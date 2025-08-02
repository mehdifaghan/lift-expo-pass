import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-elevator.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero/80"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            نمایشگاه تخصصی صنعت
            <br />
            <span className="text-accent">آسانسور و پله برقی</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
            مهر ماه ۱۴۰۴ - مرکز نمایشگاهی بوستان گفتگو تهران
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                ثبت‌نام در نمایشگاه
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20">
              اطلاعات بیشتر
            </Button>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-20 px-4 bg-gradient-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              اطلاعات نمایشگاه
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              بزرگ‌ترین رویداد تخصصی صنعت آسانسور و پله برقی در خاورمیانه
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-elegant transition-all duration-300 border-primary/10">
              <CardHeader>
                <CalendarDays className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-primary">زمان برگزاری</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  مهر ماه ۱۴۰۴
                  <br />
                  ۳ روز
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-elegant transition-all duration-300 border-primary/10">
              <CardHeader>
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-primary">مکان برگزاری</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  مرکز نمایشگاهی
                  <br />
                  بوستان گفتگو تهران
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-elegant transition-all duration-300 border-primary/10">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-primary">بازدیدکنندگان</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  متخصصان صنعت
                  <br />
                  و علاقه‌مندان
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-elegant transition-all duration-300 border-primary/10">
              <CardHeader>
                <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-primary">حامیان مالی</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  شرکت‌های معتبر
                  <br />
                  صنعت آسانسور
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            آماده حضور در نمایشگاه هستید؟
          </h2>
          <p className="text-xl mb-8 text-white/90">
            همین حالا ثبت‌نام کنید و از آخرین فناوری‌های صنعت آسانسور مطلع شوید
          </p>
          <Link to="/register">
            <Button variant="modern" size="lg" className="text-lg px-12 py-6">
              شروع ثبت‌نام
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-secondary-foreground/70">
            © ۱۴۰۴ نمایشگاه تخصصی صنعت آسانسور و پله برقی - تمامی حقوق محفوظ است
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;