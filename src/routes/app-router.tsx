import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { UserRole } from "@/api/users/types";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Public pages — small, load eagerly
import { Login } from "@/pages/public/login";
import { SignUp } from "@/pages/public/sign-up";
import { ForgotPassword } from "@/pages/public/forgot-password";
import { ResetPassword } from "@/pages/public/reset-password";
import { VerifyEmail } from "@/pages/public/verify-email";
import { GoogleCallback } from "@/pages/public/google-callback";
import { ConfirmPasswordPage } from "@/pages/public/confirm-password";
import { Admin } from "@/pages/admin";
import { AdminUsers } from "@/pages/admin/users";
import { AcceptInvite } from "@/pages/public/accept-invite";

const Sandbox = lazy(() => import("@/pages/public/sandbox").then((m) => ({ default: m.Sandbox })));
const PublicCabinetProfile = lazy(() => import("@/pages/public/cabinet-profile").then((m) => ({ default: m.PublicCabinetProfile })));
const TermsOfUsePage = lazy(() => import("@/pages/public/terms-of-use").then((m) => ({ default: m.TermsOfUsePage })));
const PrivacyPolicyPage = lazy(() => import("@/pages/public/privacy-policy").then((m) => ({ default: m.PrivacyPolicyPage })));
const LandingPage = lazy(() => import("@/pages/public/landing").then((m) => ({ default: m.LandingPage })));

const Feed = lazy(() => import("@/pages/feed").then((m) => ({ default: m.Feed })));
const Settings = lazy(() => import("@/pages/settings").then((m) => ({ default: m.Settings })));
const DemandComments = lazy(() => import("@/pages/demand-comments").then((m) => ({ default: m.DemandComments })));
const Profile = lazy(() => import("@/pages/profile").then((m) => ({ default: m.Profile })));
const Cabinets = lazy(() => import("@/pages/cabinets").then((m) => ({ default: m.Cabinets })));
const CabinetDetail = lazy(() => import("@/pages/cabinet-detail").then((m) => ({ default: m.CabinetDetail })));
const Map = lazy(() => import("@/pages/map").then((m) => ({ default: m.Map })));

const Demands = lazy(() => import("@/pages/private/demands").then((m) => ({ default: m.Demands })));
const Home = lazy(() => import("@/pages/private/home").then((m) => ({ default: m.Home })));
const Team = lazy(() => import("@/pages/private/team").then((m) => ({ default: m.Team })));
const MyTasks = lazy(() => import("@/pages/private/my-tasks").then((m) => ({ default: m.MyTasks })));
const Reports = lazy(() => import("@/pages/private/reports").then((m) => ({ default: m.Reports })));

const onlyMember = [UserRole.MEMBER];
const onlyAdmin = [UserRole.ADMIN];

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/auth/callback" element={<GoogleCallback />} />
      <Route path="/confirm-password" element={<ConfirmPasswordPage />} />
      <Route path="/cabinets/invites/:token" element={<AcceptInvite />} />
      <Route
        path="/sandbox"
        element={<Suspense fallback={<PageLoader />}><Sandbox /></Suspense>}
      />
      <Route
        path="/termos-de-uso"
        element={<Suspense fallback={<PageLoader />}><TermsOfUsePage /></Suspense>}
      />
      <Route
        path="/politica-de-privacidade"
        element={<Suspense fallback={<PageLoader />}><PrivacyPolicyPage /></Suspense>}
      />
      <Route
        path="/landingpage"
        element={<Suspense fallback={<PageLoader />}><LandingPage /></Suspense>}
      />

      <Route path="/" element={<Layout />}>
        <Route index element={<Feed />} />
        <Route path="settings" element={<Settings />} />
        <Route path="comments/:demandId" element={<DemandComments />} />
        <Route path="demands/:demandId" element={<DemandComments />} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="gabinetes" element={<Cabinets />} />
        <Route path="gabinetes/:slug" element={<CabinetDetail />} />
        <Route path="mapa" element={<Map />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={onlyAdmin}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/usuarios"
          element={
            <ProtectedRoute allowedRoles={onlyAdmin}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          index
          element={<Suspense fallback={<PageLoader />}><Feed /></Suspense>}
        />
        <Route
          path="settings"
          element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>}
        />
        <Route
          path="comments/:demandId"
          element={<Suspense fallback={<PageLoader />}><DemandComments /></Suspense>}
        />
        <Route
          path="demands/:demandId"
          element={<Suspense fallback={<PageLoader />}><DemandComments /></Suspense>}
        />
        <Route
          path="profile/:userId"
          element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>}
        />
        <Route
          path="gabinetes"
          element={<Suspense fallback={<PageLoader />}><Cabinets /></Suspense>}
        />
        <Route
          path="gabinetes/:slug"
          element={<Suspense fallback={<PageLoader />}><CabinetDetail /></Suspense>}
        />
        <Route
          path="mapa"
          element={<Suspense fallback={<PageLoader />}><Map /></Suspense>}
        />

        <Route
          path="home"
          element={
            <ProtectedRoute allowedRoles={onlyMember}>
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="demands"
          element={
            <ProtectedRoute allowedRoles={onlyMember}>
              <Suspense fallback={<PageLoader />}>
                <Demands />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="minhas-tarefas"
          element={
            <ProtectedRoute allowedRoles={onlyMember}>
              <Suspense fallback={<PageLoader />}>
                <MyTasks />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="equipe"
          element={
            <ProtectedRoute allowedRoles={onlyMember}>
              <Suspense fallback={<PageLoader />}>
                <Team />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="relatorios"
          element={
            <ProtectedRoute allowedRoles={onlyMember}>
              <Suspense fallback={<PageLoader />}>
                <Reports />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Public cabinet profile — must be last so static routes take priority */}
      <Route
        path="/:slug"
        element={<Suspense fallback={<PageLoader />}><PublicCabinetProfile /></Suspense>}
      />
    </Routes>
  );
}
