import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const { email, message, name, subject } = await request.json();

        if (!email || !message) {
            return NextResponse.json(
                { error: "Email and message are required" },
                { status: 400 }
            );
        }

        const supabase = createClient();

        // Generate a UUID to satisfy the primary key constraint
        const id = crypto.randomUUID();

        const { data, error } = await supabase
            .from("contact_requests")
            .insert([
                {
                    id,
                    email,
                    message,
                    name: name || null,
                    subject: subject || "General Inquiry",
                    status: "PENDING",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase submission error:", error);

            if (error.code === '42P01') {
                return NextResponse.json(
                    { error: "Database table 'contact_requests' not found." },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { error: "Failed to save message: " + error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Your message has been sent successfully!",
            id: data?.id
        });
    } catch (error: any) {
        console.error("Contact form API error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred. Please try again later." },
            { status: 500 }
        );
    }
}
