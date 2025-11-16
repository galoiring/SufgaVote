import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CandyCane, Cookie, GripVertical, LogOut, MessageSquare, Star, Trophy, WandSparkles } from "lucide-react";

// dnd-kit - lightweight, touch friendly
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

/**
 * MOBILE-ONLY PARTICIPANT PAGE with working drag & drop
 * - 390px-friendly layout, fluid up to 480px
 * - No horizontal scrolling; large tap targets; sticky CTAs
 * - Drag uses dnd-kit with touch sensors, vertical-only, handle-based
 */

// Mock data adapter – replace with real data
const donuts = [
  { id: "a", name: "Jelly Joy", couple: "Shai & Lenna" },
  { id: "b", name: "Ars Ashdodi", couple: "Sarah & Itzik" },
  { id: "c", name: "Cocoa Spark", couple: "Gal & Rinat" },
];

export default function ParticipantMobilePage() {
  const initial = useMemo(() => donuts, []);
  const [rank, setRank] = useState(initial);

  // Touch-friendly sensors (drag starts after small movement)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rank.findIndex((x) => x.id === String(active.id));
    const newIndex = rank.findIndex((x) => x.id === String(over.id));
    setRank((items) => arrayMove(items, oldIndex, newIndex));
  }

  return (
    <div className="min-h-dvh w-full bg-[radial-gradient(28rem_28rem_at_-20%_-20%,#94a3b820_0%,transparent_45%),radial-gradient(30rem_30rem_at_120%_-10%,#22c55e20_0%,transparent_40%),linear-gradient(180deg,#101726,#101726)] text-slate-50">
      {/* Safe column - keeps everything perfectly centered for mobile */}
      <div className="mx-auto w-full max-w-[480px] px-4 pb-28">{/* bottom space for sticky CTA */}
        {/* Header */}
        <header className="sticky top-0 z-20 -mx-4 bg-white/5 backdrop-blur-md border-b border-white/10">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/10 grid place-items-center"><Cookie className="h-4 w-4 text-amber-200"/></div>
            <div className="flex-1 leading-tight">
              <p className="text-[10px] text-slate-300">Couple</p>
              <h1 className="text-base font-semibold">Gal & Rinat</h1>
            </div>
            <Button size="sm" variant="secondary" className="rounded-lg bg-rose-500/20 border border-rose-200/20">
              <LogOut className="h-4 w-4 mr-1"/> Logout
            </Button>
          </div>
        </header>

        {/* Page title */}
        <div className="mt-4 text-center">
          <h2 className="text-lg font-semibold">Vote for Your Favorites!</h2>
        </div>

        {/* Top tabs */}
        <Tabs defaultValue="vote" className="mt-3">
          <TabsList className="grid grid-cols-3 bg-white/10 border border-white/10 rounded-2xl p-1">
            <TabsTrigger value="vote" className="data-[state=active]:bg-blue-500/20 rounded-xl">Vote</TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-white/15 rounded-xl">Comments</TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-white/15 rounded-xl">Results</TabsTrigger>
          </TabsList>

          {/* VOTE TAB */}
          <TabsContent value="vote" className="mt-4 space-y-4">
            {/* Category selector */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Select Category</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                <CategoryPill icon={<Star className="h-4 w-4"/>} label="Taste" active />
                <CategoryPill icon={<WandSparkles className="h-4 w-4"/>} label="Creativity" />
                <CategoryPill icon={<Trophy className="h-4 w-4"/>} label="Presentation" />
              </CardContent>
            </Card>

            {/* Ranking list with dnd */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-1">
                <CardTitle className="text-base">Rank Sufganiot (taste)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-300">Drag the handle to reorder. Top = Best, Bottom = Least favorite</p>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEnd}
                  modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                >
                  <SortableContext items={rank.map((x) => x.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {rank.map((item, idx) => (
                        <SortableDonutRow key={item.id} id={item.id} index={idx + 1} name={item.name} couple={item.couple} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </CardContent>
            </Card>

            {/* Sticky Save CTA */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#101726] via-[#101726]/95 to-transparent">
              <div className="mx-auto max-w-[480px] px-4 py-4">
                <Button className="w-full h-12 rounded-xl text-base shadow-lg bg-blue-500 hover:bg-blue-500/90">
                  Save taste rankings
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* COMMENTS TAB */}
          <TabsContent value="comments" className="mt-4 space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Leave a friendly comment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Write a positive comment (optional)" className="bg-white/5 border-white/10" />
                <div className="text-[11px] text-slate-300">
                  Be kind. Comments may be shown when results are published.
                </div>
                <Button className="w-full rounded-xl">Submit comment</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RESULTS TAB (placeholder) */}
          <TabsContent value="results" className="mt-4 space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Results</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-200">
                Results will be revealed when the admin publishes them. Good luck!
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer note */}
        <div className="pt-6 pb-8 text-center text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <CandyCane className="h-3 w-3"/> Sweet holiday voting
          </span>
        </div>
      </div>
    </div>
  );
}

function CategoryPill({ label, icon, active = false }: { label: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-sm",
        "border-white/15 bg-white/5",
        active && "bg-blue-500/20 border-blue-300/20"
      )}
    >
      <div className="h-8 w-8 rounded-full grid place-items-center bg-white/10">{icon}</div>
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Sortable row for drag & drop
function SortableDonutRow({ id, index, name, couple }: { id: string; index: number; name: string; couple: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    opacity: isDragging ? 0.95 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 shadow",
      "bg-white/90 text-slate-900",
      isDragging && "ring-2 ring-blue-300/60")}
    >
      <Badge className="rounded-lg px-2 py-1 text-base font-bold bg-gradient-to-b from-blue-50 to-blue-100 text-blue-600 border border-blue-200">#{index}</Badge>
      <div className="flex-1">
        <div className="font-semibold leading-tight">{name}</div>
        <div className="text-[12px] text-slate-600">by {couple}</div>
      </div>
      {/* Drag handle only */}
      <button
        aria-label="Drag to reorder"
        className="text-slate-400 active:text-slate-600 p-1 -m-1"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5"/>
      </button>
    </div>
  );
}
