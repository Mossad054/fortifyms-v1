'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  Globe,
  Trophy,
  Lightbulb,
  Download,
  FileText,
  Settings,
  Brain,
  Calendar,
  Activity
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setUserRole(user.user_metadata?.role || '');
    };
    getUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleExportReport = async (format: 'pdf' | 'excel') => {
    try {
      console.log(`Exporting ${format} report...`);
      // Implementation placeholder
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EFEA] text-gray-900">
      <div className="container mx-auto py-6 space-y-6">

        {/* Premium Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 glass-panel p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Activity className="w-8 h-8 text-green-600" />
              Analytics Center
            </h1>
            <p className="text-gray-600 mt-1 pl-10">
              Comprehensive procurement and supply chain intelligence
            </p>
          </div>
          <div className="flex gap-3 pl-10 md:pl-0">
            <Button
              variant="outline"
              onClick={() => handleExportReport('pdf')}
              className="bg-white/50 hover:bg-white border-green-100 text-green-800 hover:text-green-900 shadow-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="premium" className="shadow-lg shadow-green-900/10">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="shadow-sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-[#0A3225]/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-[#0A3225]" />
                </div>
                <div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-muted-foreground">Real-time Analytics</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm text-muted-foreground">Key Metrics</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="h-6 w-6 text-orange" />
                </div>
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Certified Mills</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/40 p-1 backdrop-blur-md rounded-xl border border-white/20">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden md:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="hidden md:inline">Maps</span>
            </TabsTrigger>
            <TabsTrigger value="rankings" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden md:inline">Rankings</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>High-level metrics across all regions</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center text-muted-foreground">
                Chart Placeholder
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content would go here */}
        </Tabs>
      </div>
    </div>
  );
}
