import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

export function PlanDisplay({ plan }: { plan: string }) {
  return (
    <div>
      <MarkdownRenderer content={plan} />
    </div>
  );
}
