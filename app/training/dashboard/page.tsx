"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import trainingTracksData from "@/data/training-tracks.json";
import usersData from "@/data/users.json";

export default function TrainingDashboard() {
  // Mock current user (Jamie R.)
  const currentUser = usersData.find(u => u.id === "user-1");
  const trainingTracks = trainingTracksData;

  if (!currentUser) {
    return <div>User not found</div>;
  }

  const track1 = trainingTracks[0];
  const track2 = trainingTracks[1];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={currentUser.photoUrl} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.split(' ')[0][0]}{currentUser.name.split(' ')[1][0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Welcome, {currentUser.name}</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
      </div>

      {/* Assigned Training Tracks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Assigned Training Tracks</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Track 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{track1.title}</CardTitle>
                    <CardDescription>{track1.description}</CardDescription>
                  </div>
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    {track1.status === 'in_progress' ? 'In Progress' : track1.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-semibold">{track1.progress}% complete</span>
                  </div>
                  <Progress value={track1.progress} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Next module due:</p>
                  <p>Module 4: Legal & Privacy (due in 3 days)</p>
                </div>
                <Button className="w-full">Continue Training</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Track 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="opacity-60 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      {track2.title}
                    </CardTitle>
                    <CardDescription>{track2.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">Locked</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Complete Track 1 to unlock this course
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Certifications</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { name: "Foundation Certificate", earned: false },
            { name: "ITPB (Insider Threat Program Builder)", earned: false },
            { name: "AITC (Advanced Insider Threat Consultant)", earned: false }
          ].map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={cert.earned ? "border-green-500" : "border-gray-200"}>
                <CardHeader>
                  <CardTitle className="text-lg">{cert.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {cert.earned ? (
                    <Badge className="bg-green-500">Earned</Badge>
                  ) : (
                    <Badge variant="outline">Not earned yet</Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>You have 1 module due this week</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Completed Module 3: Insider Threat Frameworks</p>
                  <p className="text-sm text-muted-foreground">Score: 85%</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mt-0.5">
                  ▶
                </div>
                <div>
                  <p className="font-medium">Started Module 4: Legal & Privacy Considerations</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
