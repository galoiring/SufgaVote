import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import {
  Lock,
  Unlock,
  Snowflake,
  Star,
  Trash2,
  CandyCane,
  Cookie,
  Gift,
} from "lucide-react";

const initialCouples = [
  { id: 1, name: "Gal & Rinat", code: "MM79J3", hasVoted: false },
  { id: 2, name: "Lior & Maya", code: "QZ12K8", hasVoted: true },
];

export default function FestiveAdminPOC() {
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [areResultsPublic, setAreResultsPublic] = useState(false);
  const [activeTab, setActiveTab] = useState("couples");
  const [couples, setCouples] = useState(initialCouples);
  const [newCouple, setNewCouple] = useState("");

  const addCouple = () => {
    if (!newCouple.trim()) return;
    setCouples((c) => [
      ...c,
      {
        id: Date.now(),
        name: newCouple.trim(),
        code: Math.random().toString(36).slice(2, 8).toUpperCase(),
        hasVoted: false,
      },
    ]);
    setNewCouple("");
    toast.success("Couple added");
  };

  const deleteCouple = (id: number) => {
    setCouples((c) => c.filter((x) => x.id !== id));
    toast("Couple removed");
  };

  return (
    <div className='min-h-screen w-full bg-[radial-gradient(40rem_40rem_at_-10%_-20%,#94a3b8_0%,transparent_45%),radial-gradient(50rem_50rem_at_110%_-10%,#22c55e20_0%,transparent_40%),radial-gradient(60rem_60rem_at_50%_110%,#0ea5e920_0%,transparent_40%),linear-gradient(180deg,#152032,#152032)] text-slate-50'>
      {/* Decorative background with subtle Christmas touch */}
      <div className='pointer-events-none fixed inset-0 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000_60%,transparent_100%)]'>
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1608889175123-58b94e6a7b72?q=80&w=1400&auto=format&fit=crop')] bg-cover" />
      </div>

      <header className='sticky top-0 z-20 backdrop-blur-md bg-white/10 border-b border-white/10'>
        <div className='mx-auto max-w-6xl px-4 py-4 flex items-center gap-3'>
          <div className='h-9 w-9 rounded-xl bg-white/10 grid place-items-center shadow-inner'>
            <Cookie className='h-5 w-5 text-amber-200' />
          </div>
          <div className='flex-1'>
            <h1 className='text-xl font-semibold tracking-tight'>
              SufgaVote Admin
            </h1>
            <p className='text-xs text-slate-200'>
              Festive dashboard - cozy, bright and cheerful
            </p>
          </div>
          <div className='flex items-center gap-2 text-slate-200'>
            <Gift className='h-4 w-4' />
            <Snowflake className='h-4 w-4' />
            <CandyCane className='h-4 w-4' />
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-6xl px-4 py-8 grid gap-6'>
        {/* Control Panel */}
        <Card className='bg-white/10 backdrop-blur-xl border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)]'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Star className='h-5 w-5 text-yellow-300' /> Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-3 text-slate-100'>
            <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-green-400/10 to-emerald-300/10 px-4 py-4'>
              <div>
                <p className='text-sm text-slate-200'>Voting Status</p>
                <p className='font-medium flex items-center gap-2'>
                  {isVotingOpen ? (
                    <span className='inline-flex items-center gap-1 text-emerald-200'>
                      <Unlock className='h-4 w-4' /> Open
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1 text-rose-200'>
                      <Lock className='h-4 w-4' /> Closed
                    </span>
                  )}
                </p>
              </div>
              <Toggle
                pressed={isVotingOpen}
                onPressedChange={(v) => {
                  setIsVotingOpen(v);
                  toast(v ? "Voting opened" : "Voting closed");
                }}
                className='data-[state=on]:bg-emerald-500/30 data-[state=on]:text-emerald-100 bg-white/10 border border-white/10 rounded-xl px-4 py-2'
              >
                {isVotingOpen ? "Close Voting" : "Open Voting"}
              </Toggle>
            </div>

            <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-sky-400/10 to-blue-200/10 px-4 py-4'>
              <div>
                <p className='text-sm text-slate-200'>Results</p>
                <p className='font-medium flex items-center gap-2'>
                  {areResultsPublic ? (
                    <span className='inline-flex items-center gap-1 text-sky-200'>
                      <Unlock className='h-4 w-4' /> Public
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1 text-slate-200'>
                      <Lock className='h-4 w-4' /> Hidden
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant='secondary'
                onClick={() => {
                  setAreResultsPublic(!areResultsPublic);
                  toast("Results visibility updated");
                }}
                className='rounded-xl bg-white/10 border border-white/10 hover:bg-white/20'
              >
                {areResultsPublic ? "Hide Results" : "Publish Results"}
              </Button>
            </div>

            <div className='rounded-2xl border border-white/10 bg-gradient-to-br from-red-400/10 to-amber-200/10 px-4 py-4 text-slate-200'>
              <p className='text-sm'>Holiday spirit</p>
              <div className='mt-2 flex items-center gap-2 text-sm'>
                <span className='inline-flex items-center gap-1'>
                  <CandyCane className='h-4 w-4' /> Sweet joy
                </span>
                <span className='opacity-60'>•</span>
                <span className='inline-flex items-center gap-1'>
                  <Snowflake className='h-4 w-4' /> Winter sparkle
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='bg-white/10 border border-white/10 rounded-2xl p-1 text-slate-200'>
            <TabsTrigger
              value='couples'
              className='data-[state=active]:bg-green-400/20 rounded-xl'
            >
              Couples
            </TabsTrigger>
            <TabsTrigger
              value='sufganiot'
              className='data-[state=active]:bg-blue-400/20 rounded-xl'
            >
              Sufganiot
            </TabsTrigger>
            <TabsTrigger
              value='results'
              className='data-[state=active]:bg-amber-400/20 rounded-xl'
            >
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value='couples' className='mt-4 grid gap-6'>
            <Card className='bg-white/10 backdrop-blur-xl border-white/10'>
              <CardHeader>
                <CardTitle className='text-slate-100'>Add New Couple</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-3 md:flex-row'>
                <Input
                  placeholder='Couple name'
                  value={newCouple}
                  onChange={(e) => setNewCouple(e.target.value)}
                  className='bg-white/5 border-white/10 text-slate-100'
                />
                <Button
                  onClick={addCouple}
                  className='rounded-xl bg-green-500/30 hover:bg-green-400/40'
                >
                  Add Couple
                </Button>
              </CardContent>
            </Card>

            <Card className='bg-white/10 backdrop-blur-xl border-white/10'>
              <CardHeader>
                <CardTitle className='text-slate-100'>Couples List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='overflow-hidden rounded-2xl border border-white/10'>
                  <table className='w-full text-left text-slate-100'>
                    <thead className='bg-white/5 text-slate-200'>
                      <tr>
                        <th className='px-4 py-3'>Name</th>
                        <th className='px-4 py-3'>Login Code</th>
                        <th className='px-4 py-3'>Has Voted</th>
                        <th className='px-4 py-3 text-right'>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {couples.map((c) => (
                        <tr
                          key={c.id}
                          className='odd:bg-white/[.04] even:bg-white/[.02] border-t border-white/5'
                        >
                          <td className='px-4 py-3 font-medium'>{c.name}</td>
                          <td className='px-4 py-3 tracking-wider text-sky-200'>
                            {c.code}
                          </td>
                          <td className='px-4 py-3'>
                            {c.hasVoted ? (
                              <span className='text-green-300'>Yes</span>
                            ) : (
                              <span className='text-slate-200'>Pending</span>
                            )}
                          </td>
                          <td className='px-4 py-3'>
                            <div className='flex justify-end gap-2'>
                              <Button
                                variant='secondary'
                                className='rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-300/20'
                                onClick={() => deleteCouple(c.id)}
                              >
                                <Trash2 className='h-4 w-4 mr-1' /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='sufganiot' className='mt-4'>
            <Card className='bg-white/10 backdrop-blur-xl border-white/10 text-slate-100'>
              <CardHeader>
                <CardTitle>Sufganiot (coming soon)</CardTitle>
              </CardHeader>
              <CardContent>
                Manage each donut's name, photo, and description. Assign to
                couples and set tasting order.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='results' className='mt-4'>
            <Card className='bg-white/10 backdrop-blur-xl border-white/10 text-slate-100'>
              <CardHeader>
                <CardTitle>Results (coming soon)</CardTitle>
              </CardHeader>
              <CardContent>
                Real-time leaderboard with festive confetti and sweet badges.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className='pt-6 pb-10 text-center text-xs text-slate-300'>
          <p className='inline-flex items-center gap-2 opacity-80'>
            <CandyCane className='h-3 w-3' /> May your donuts be jelly and your
            nights be merry
          </p>
        </footer>
      </main>
    </div>
  );
}
