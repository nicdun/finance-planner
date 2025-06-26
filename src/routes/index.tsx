// src/routes/index.tsx
import * as fs from "node:fs";
import { useRouter, createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp,
  Shield,
  Users,
  Award,
  CheckCircle,
  Euro,
  PiggyBank,
  BarChart3,
  Phone,
  Mail,
  MapPin,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0")
  );
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute("/")({
  component: Home,
});

export function Home() {
  const { user, signOut, loading } = useAuth();

  const handleAccountClick = () => {
    // Navigation will be handled by the Link component
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Euro className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  FinanzCoach Pro
                </h1>
                <p className="text-sm text-gray-600">Deutsche Bank Gruppe</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a
                href="#services"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Leistungen
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Über mich
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Referenzen
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Kontakt
              </a>
            </nav>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Abmelden</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  Anmelden
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                Zertifizierte Finanzberatung
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Ihre finanzielle
                <span className="text-blue-600 block">
                  Zukunft beginnt heute
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Als erfahrener FinanzCoach der Deutschen Bank helfe ich Ihnen
                dabei, Ihre finanziellen Ziele zu erreichen und eine sichere
                Zukunft aufzubauen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
                >
                  Kostenlose Erstberatung
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-4"
                >
                  Mehr erfahren
                </Button>
              </div>
              <div className="flex items-center gap-8 mt-8 pt-8 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Zufriedene Kunden</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Jahre Erfahrung</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">€50M+</div>
                  <div className="text-sm text-gray-600">
                    Verwaltetes Vermögen
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pl-12">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-20"></div>
                <Card className="relative bg-white border-0 shadow-2xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Portfolio Performance
                        </CardTitle>
                        <CardDescription>
                          Ihre Investitionen im Überblick
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Gesamtrendite (YTD)
                        </span>
                        <span className="text-lg font-semibold text-green-600">
                          +12.4%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                          style={{ width: "74%" }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Ziel: €250,000</span>
                        <span>Aktuell: €185,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              Meine Leistungen
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Umfassende Finanzberatung für Ihren Erfolg
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Von der Vermögensplanung bis zur Altersvorsorge - ich begleite Sie
              auf Ihrem Weg zur finanziellen Unabhängigkeit.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <PiggyBank className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Vermögensaufbau</CardTitle>
                <CardDescription>
                  Strategien für nachhaltigen Vermögensaufbau und optimale
                  Renditen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Individuelle Anlagestrategie
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Risikomanagement
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Diversifikation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Altersvorsorge</CardTitle>
                <CardDescription>
                  Planen Sie heute für einen sorgenfreien Ruhestand von morgen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Rentenplanung
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Private Vorsorge
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Steueroptimierung
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Finanzanalyse</CardTitle>
                <CardDescription>
                  Detaillierte Analyse Ihrer aktuellen Finanzsituation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Portfolio-Bewertung
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Kostenanalyse
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Optimierungsvorschläge
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                Über mich
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Erfahrung, die Sie weiterbringt
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Mit über 15 Jahren Erfahrung in der Finanzbranche und als
                zertifizierter Berater der Deutschen Bank bringe ich die
                Expertise mit, die Sie für Ihre finanziellen Entscheidungen
                benötigen.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    Zertifizierter Finanzplaner (CFP)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    Über 500 zufriedene Kunden
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    Durchschnittliche Rendite: 8.5% p.a.
                  </span>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Persönliches Gespräch vereinbaren
              </Button>
            </div>
            <div className="lg:pl-12">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">
                    Meine Qualifikationen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Certified Financial Planner (CFP)
                    </h4>
                    <p className="text-sm text-blue-700">
                      International anerkannte Zertifizierung
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Master in Finance
                    </h4>
                    <p className="text-sm text-blue-700">
                      Frankfurt School of Finance & Management
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Deutsche Bank Zertifizierung
                    </h4>
                    <p className="text-sm text-blue-700">
                      Spezialist für Vermögensberatung
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
              Kundenstimmen
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Was meine Kunden sagen
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <CardTitle className="text-base">Maria Schmidt</CardTitle>
                    <CardDescription>Unternehmerin, München</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "Dank der professionellen Beratung konnte ich meine
                  Altersvorsorge optimal strukturieren. Die Rendite übertrifft
                  meine Erwartungen!"
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 text-yellow-400">
                      ★
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <CardTitle className="text-base">Thomas Weber</CardTitle>
                    <CardDescription>IT-Manager, Hamburg</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "Kompetente und verständliche Beratung. Mein Portfolio ist
                  jetzt deutlich besser diversifiziert und performt
                  hervorragend."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 text-yellow-400">
                      ★
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <CardTitle className="text-base">Anna Müller</CardTitle>
                    <CardDescription>Ärztin, Berlin</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  "Endlich habe ich einen Überblick über meine Finanzen. Die
                  Beratung war sehr professionell und auf meine Bedürfnisse
                  zugeschnitten."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 text-yellow-400">
                      ★
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Bereit für Ihre finanzielle Zukunft?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Vereinbaren Sie noch heute Ihren kostenlosen Beratungstermin und
              lassen Sie uns gemeinsam Ihre finanziellen Ziele erreichen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <Card className="bg-white text-gray-900">
              <CardHeader>
                <CardTitle>Kontakt aufnehmen</CardTitle>
                <CardDescription>
                  Ich freue mich auf unser Gespräch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>+49 (0) 69 123 456 789</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>coach@deutsche-bank-finanz.de</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>
                    Deutsche Bank Filiale
                    <br />
                    Taunusanlage 12, 60325 Frankfurt
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Warum Deutsche Bank?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-blue-200 mt-1" />
                  <div>
                    <h4 className="font-semibold">Sicherheit & Vertrauen</h4>
                    <p className="text-blue-100">
                      Über 150 Jahre Erfahrung im Bankwesen
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-6 w-6 text-blue-200 mt-1" />
                  <div>
                    <h4 className="font-semibold">Beste Konditionen</h4>
                    <p className="text-blue-100">
                      Exklusive Angebote für unsere Kunden
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-blue-200 mt-1" />
                  <div>
                    <h4 className="font-semibold">Persönliche Betreuung</h4>
                    <p className="text-blue-100">
                      Ihr fester Ansprechpartner vor Ort
                    </p>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-white text-blue-600 hover:bg-blue-50 text-lg py-4"
              >
                Termin vereinbaren
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Euro className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">FinanzCoach Pro</span>
              </div>
              <p className="text-gray-400 text-sm">
                Ihr Partner für eine erfolgreiche finanzielle Zukunft.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Vermögensaufbau</li>
                <li>Altersvorsorge</li>
                <li>Finanzanalyse</li>
                <li>Steueroptimierung</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Unternehmen</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Über uns</li>
                <li>Karriere</li>
                <li>Presse</li>
                <li>Kontakt</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Impressum</li>
                <li>Datenschutz</li>
                <li>AGB</li>
                <li>Risikohinweise</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Deutsche Bank AG. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
