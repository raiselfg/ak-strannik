import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ak-strannik/ui/components/card';
import { createFileRoute } from '@tanstack/react-router';

import { useAuthState } from '../../features/auth/hooks/use-auth';

export const Route = createFileRoute('/_protected/')({
  component: AdminHomePage,
});

function AdminHomePage() {
  const { user } = useAuthState();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Авторизация настроена</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          Вы вошли как <span className="font-medium">{user?.login}</span>
        </p>
        <p className="text-muted-foreground">
          Основа административной панели готова к разработке бизнес-функций.
        </p>
      </CardContent>
    </Card>
  );
}
