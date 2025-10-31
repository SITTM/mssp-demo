import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, Search, BarChart, Shield, Monitor } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold">MSSP Training Platform</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive insider threat training and program building platform for MSSP analysts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {/* SOC Analyst Desktop */}
        <Card className="hover:shadow-lg transition-shadow border-blue-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-500" />
              <CardTitle>SOC Analyst Console</CardTitle>
            </div>
            <CardDescription>
              Your personal workspace for investigating alerts and managing incidents across 150+ clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/soc/analyst">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Launch Console</Button>
            </Link>
          </CardContent>
        </Card>

        {/* SOC Wallboard */}
        <Card className="hover:shadow-lg transition-shadow border-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="h-6 w-6 text-purple-500" />
              <CardTitle>SOC Wallboard</CardTitle>
            </div>
            <CardDescription>
              Real-time operational dashboard for team situational awareness and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/soc/wallboard">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Open Wallboard</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Flow 1: Training Dashboard */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-green-500" />
              <CardTitle>Training Dashboard</CardTitle>
            </div>
            <CardDescription>
              View your training progress, complete modules, and earn certifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/training/dashboard">
              <Button className="w-full">Go to Training</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Flow 2: Playbook Engine */}
        <Card className="hover:shadow-lg transition-shadow opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-orange-500" />
              <CardTitle>Playbook Engine</CardTitle>
            </div>
            <CardDescription>
              Execute guided workflows for client maturity assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Flow 3: Workshop Tools */}
        <Card className="hover:shadow-lg transition-shadow opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-500" />
              <CardTitle>Workshop Tools</CardTitle>
            </div>
            <CardDescription>
              Facilitate collaborative risk scenario prioritization sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Flow 4: Knowledge Base */}
        <Card className="hover:shadow-lg transition-shadow opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-6 w-6 text-cyan-500" />
              <CardTitle>Knowledge Base</CardTitle>
            </div>
            <CardDescription>
              Search for regulations, templates, and case studies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Flow 5: Client Dashboard */}
        <Card className="hover:shadow-lg transition-shadow opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart className="h-6 w-6 text-red-500" />
              <CardTitle>Client Dashboard</CardTitle>
            </div>
            <CardDescription>
              Track progress across all Track A clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Built with Next.js, React, TypeScript, and Tailwind CSS</p>
        <p>Aligned with Oversight-MVP design system</p>
      </div>
    </div>
  );
}
