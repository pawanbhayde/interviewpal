import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export const useUser = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data?.user ?? null)
        }

        fetchUser()

        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null)
            }
        )

        // Cleanup function to unsubscribe
        return () => {
            listener?.subscription?.unsubscribe()
        }
    }, [])

    return { user }
}
