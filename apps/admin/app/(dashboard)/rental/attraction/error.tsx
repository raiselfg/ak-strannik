'use client';
import { Button } from '@ak-strannik/ui/components/button';
import { Card, CardContent } from '@ak-strannik/ui/components/card';
import { TriangleAlert } from 'lucide-react';
export default function AttractionError({ reset }: { reset: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-12 text-center">
        <TriangleAlert className="mb-4 size-8 text-destructive" />
        <h1 className="text-lg font-semibold">
          Не удалось загрузить аттракционы
        </h1>
        <Button className="mt-5" onClick={reset}>
          Повторить
        </Button>
      </CardContent>
    </Card>
  );
}
