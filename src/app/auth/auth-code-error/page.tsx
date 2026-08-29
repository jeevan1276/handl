"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md glass-card text-center">
        <CardHeader>
          <CardTitle className="text-destructive">Authentication Error</CardTitle>
          <CardDescription>
            There was an issue with the authentication code. This can happen if the link has expired or was already used.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => window.location.href = "/login"}>
            Try Logging In Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/register"}>
            Create New Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}