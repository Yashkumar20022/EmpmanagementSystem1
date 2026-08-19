import { createContext, useContext, useEffect, useState } from 'react'
import * as React from 'react'
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabaseClient'

const AuthContext = React.createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = React.useState(null)
  const [profile, setProfile] = React.useState(null) // row from `employees` table
  const [loading, setLoading] = React.useState(true)

  async function loadProfile(userId) {
    // Try to find profile by linked user_id first
    let { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      // If not found by user_id, try to match by email (handles rows created without user_id)
      try {
        const {
          data: sessionData,
        } = await supabase.auth.getUser() // get the current user to access email
        const userEmail = sessionData?.user?.email
        if (userEmail) {
          const res = await supabase
            .from('employees')
            .select('*')
            .eq('email', userEmail)
            .single()
          if (res.data) {
            data = res.data
            // Link the existing employee row to this auth user for future logins
            await supabase.from('employees').update({ user_id: userId }).eq('id', data.id)
          }
        }
      } catch (e) {
        console.error('Profile lookup by email failed:', e?.message || e)
      }
    }

    if (!data) {
      // If no employee row found, create a minimal one so the app has a profile to work with.
      try {
        const {
          data: created,
          error: createErr,
        } = await supabase
          .from('employees')
          .insert({ user_id: userId, email: session?.user?.email ?? null, full_name: null, role: 'employee' })
          .select()
          .single()

        if (createErr) {
          console.error('Failed to create employee row for user:', createErr.message)
          setProfile(null)
          return
        }

        setProfile(created)
        return
      } catch (e) {
        console.error('Error creating employee row:', e?.message || e)
        setProfile(null)
        return
      }
    }

    setProfile(data)
  }

  React.useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session?.user) await loadProfile(session.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  async function login(email, password) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return { error: { message: 'Supabase URL or anon key is missing. Check your .env file.' } }
    }

    // quick network check to detect obvious unreachable URL
    try {
      // fetch root of Supabase project to verify reachability. Use no-cors to avoid CORS blocking the response read;
      // if the request fails due to network/DNS, this will throw.
      await fetch(SUPABASE_URL, { method: 'GET', mode: 'no-cors' })
    } catch (e) {
      console.error('Supabase reachability check failed:', e)
      return { error: { message: 'Network error: cannot reach Supabase. Check VITE_SUPABASE_URL and your network.' } }
    }

    try {
      const res = await supabase.auth.signInWithPassword({ email, password })
      // return full response so callers can inspect data.session if needed
      return res
    } catch (e) {
      console.error('Login failed:', e)
      const msg = e?.message || String(e)
      return { data: null, error: { message: msg.includes('Failed to fetch') ? 'Network error: failed to contact Supabase. Check VITE_SUPABASE_URL, network, or CORS settings.' : msg } }
    }
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    loading,
    login,
    logout,
    refreshProfile: () => session?.user && loadProfile(session.user.id),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
