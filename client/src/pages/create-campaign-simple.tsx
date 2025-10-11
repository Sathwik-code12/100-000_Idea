import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Rocket, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/header";
import NewFooter from "@/components/sections/new-footer";

export default function CreateCampaign() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto py-16 px-4">
          <Card>
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h1>
              <p className="text-gray-600 mb-8">You need to be logged in to create a campaign.</p>
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <NewFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Detailed Campaign</h1>
          <p className="text-gray-600">Launch your comprehensive fundraising campaign</p>
        </div>

        {/* Coming Soon Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-blue-600" />
              Detailed Campaign Creation
            </CardTitle>
          </CardHeader>
          <CardContent className="py-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Comprehensive Campaign Builder Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                We're building a detailed campaign creation system that will include:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Personal Information</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Complete profile setup</li>
                    <li>• Professional background</li>
                    <li>• Educational details</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Business Details</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Company information</li>
                    <li>• Market analysis</li>
                    <li>• Financial projections</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Team Information</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Co-founder profiles</li>
                    <li>• Team expertise</li>
                    <li>• Equity distribution</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Campaign Setup</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Funding goals</li>
                    <li>• Investment terms</li>
                    <li>• Risk assessment</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/dashboard">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
                
                <Link href="/start-campaign">
                  <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                    <Rocket className="h-4 w-4" />
                    Try Quick Setup Instead
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewFooter />
    </div>
  );
}