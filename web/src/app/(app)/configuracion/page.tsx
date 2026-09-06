import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
          Configuración
        </h1>
        <p className="text-sm text-muted-foreground">Vista en construcción.</p>
      </div>
      <Card>
        <CardContent className="p-10 text-center text-sm text-muted-foreground">
          Pendiente de conectar a Convex.
        </CardContent>
      </Card>
    </div>
  );
}
