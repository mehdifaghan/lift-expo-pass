import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Phone, User, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [step, setStep] = useState("type"); // type, phone, otp, form
  const [userType, setUserType] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!phone.match(/^09\d{9}$/)) {
      toast({
        title: "خطا",
        description: "شماره تلفن وارد شده صحیح نمی‌باشد",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api.php?action=send_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `phone=${phone}`
      });
      
      const result = await response.json();
      if (result.status === "ok") {
        setStep("otp");
        toast({
          title: "موفقیت",
          description: "کد تایید به شماره شما ارسال شد"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "ارسال کد تایید با مشکل مواجه شد",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api.php?action=verify_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `phone=${phone}&otp=${otp}`
      });
      
      const result = await response.json();
      if (result.status === "ok") {
        // Register initial data
        const initResponse = await fetch('/api.php?action=register_init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `phone=${phone}&type=${userType}`
        });
        
        if (initResponse.ok) {
          setStep("form");
          toast({
            title: "موفقیت",
            description: "تایید انجام شد. لطفاً فرم را تکمیل کنید"
          });
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "کد تایید نادرست است",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const TypeSelection = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">نوع ثبت‌نام</CardTitle>
        <CardDescription>لطفاً نوع حضور خود را انتخاب کنید</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant={userType === "visitor" ? "default" : "outline"}
          className="w-full h-16 text-lg"
          onClick={() => {
            setUserType("visitor");
            setStep("phone");
          }}
        >
          <User className="ml-2" />
          بازدیدکننده
        </Button>
        <Button
          variant={userType === "sponsor" ? "default" : "outline"}
          className="w-full h-16 text-lg"
          onClick={() => {
            setUserType("sponsor");
            setStep("phone");
          }}
        >
          <Building2 className="ml-2" />
          حامی مالی / غرفه‌دار
        </Button>
      </CardContent>
    </Card>
  );

  const PhoneVerification = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">تایید شماره تلفن</CardTitle>
        <CardDescription>شماره موبایل خود را وارد کنید</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">شماره موبایل</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="09123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={11}
            autoComplete="tel"
            dir="ltr"
          />
        </div>
        <Button 
          onClick={handleSendOTP} 
          disabled={loading || !phone.match(/^09\d{9}$/)}
          className="w-full"
        >
          <Phone className="ml-2" />
          {loading ? "در حال ارسال..." : "ارسال کد تایید"}
        </Button>
        <Button variant="outline" onClick={() => setStep("type")} className="w-full">
          <ArrowLeft className="ml-2" />
          بازگشت
        </Button>
      </CardContent>
    </Card>
  );

  const OTPVerification = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">کد تایید</CardTitle>
        <CardDescription>کد ارسال شده به {phone} را وارد کنید</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">کد تایید</Label>
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="text-center text-2xl"
          />
        </div>
        <Button 
          onClick={handleVerifyOTP} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "در حال تایید..." : "تایید کد"}
        </Button>
        <Button variant="outline" onClick={() => setStep("phone")} className="w-full">
          <ArrowLeft className="ml-2" />
          بازگشت
        </Button>
      </CardContent>
    </Card>
  );

  const RegistrationForm = () => {
    if (userType === "visitor") {
      return <VisitorForm />;
    } else {
      return <SponsorForm />;
    }
  };

  const VisitorForm = () => {
    const [formData, setFormData] = useState({
      full_name: "",
      national_code: "",
      education: "",
      field: "",
      birth_date: "",
      job: "",
      city: "",
      address: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const response = await fetch('/api.php?action=register_visitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        
        const result = await response.json();
        if (result.status === "ok") {
          toast({
            title: "موفقیت",
            description: `ثبت‌نام با موفقیت انجام شد. کد شما: ${result.code}`,
          });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        toast({
          title: "خطا",
          description: "ثبت‌نام با مشکل مواجه شد",
          variant: "destructive"
        });
      }
      setLoading(false);
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">فرم ثبت‌نام بازدیدکننده</CardTitle>
          <CardDescription>لطفاً اطلاعات خود را تکمیل کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">نام و نام خانوادگی</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="national_code">کد ملی</Label>
                <Input
                  id="national_code"
                  required
                  value={formData.national_code}
                  onChange={(e) => setFormData({...formData, national_code: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education">تحصیلات</Label>
                <Select onValueChange={(value) => setFormData({...formData, education: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="دیپلم">دیپلم</SelectItem>
                    <SelectItem value="کاردانی">کاردانی</SelectItem>
                    <SelectItem value="کارشناسی">کارشناسی</SelectItem>
                    <SelectItem value="کارشناسی ارشد">کارشناسی ارشد</SelectItem>
                    <SelectItem value="دکتری">دکتری</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="field">رشته تحصیلی</Label>
                <Input
                  id="field"
                  value={formData.field}
                  onChange={(e) => setFormData({...formData, field: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birth_date">تاریخ تولد</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job">شغل</Label>
                <Input
                  id="job"
                  value={formData.job}
                  onChange={(e) => setFormData({...formData, job: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">شهر</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">آدرس</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "در حال ثبت‌نام..." : "تکمیل ثبت‌نام"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  const SponsorForm = () => {
    const [formData, setFormData] = useState({
      company_name: "",
      business_id: "",
      ceo_name: "",
      ceo_phone: "",
      company_phone: "",
      city: "",
      address: "",
      booth_area: "",
      booth_height: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const response = await fetch('/api.php?action=register_sponsor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        
        const result = await response.json();
        if (result.status === "ok") {
          toast({
            title: "موفقیت",
            description: "ثبت‌نام حامی مالی با موفقیت انجام شد",
          });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        toast({
          title: "خطا",
          description: "ثبت‌نام با مشکل مواجه شد",
          variant: "destructive"
        });
      }
      setLoading(false);
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">فرم ثبت‌نام حامی مالی</CardTitle>
          <CardDescription>اطلاعات شرکت خود را وارد کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">نام شرکت</Label>
                <Input
                  id="company_name"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_id">شناسه ملی شرکت</Label>
                <Input
                  id="business_id"
                  required
                  value={formData.business_id}
                  onChange={(e) => setFormData({...formData, business_id: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ceo_name">نام مدیرعامل</Label>
                <Input
                  id="ceo_name"
                  required
                  value={formData.ceo_name}
                  onChange={(e) => setFormData({...formData, ceo_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ceo_phone">تلفن مدیرعامل</Label>
                <Input
                  id="ceo_phone"
                  type="tel"
                  value={formData.ceo_phone}
                  onChange={(e) => setFormData({...formData, ceo_phone: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_phone">تلفن شرکت</Label>
                <Input
                  id="company_phone"
                  type="tel"
                  required
                  value={formData.company_phone}
                  onChange={(e) => setFormData({...formData, company_phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">شهر</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">آدرس شرکت</Label>
              <Textarea
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="booth_area">متراژ غرفه مورد نیاز</Label>
                <Input
                  id="booth_area"
                  type="number"
                  value={formData.booth_area}
                  onChange={(e) => setFormData({...formData, booth_area: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booth_height">ارتفاع غرفه مورد نیاز</Label>
                <Input
                  id="booth_height"
                  type="number"
                  value={formData.booth_height}
                  onChange={(e) => setFormData({...formData, booth_height: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "در حال ثبت‌نام..." : "تکمیل ثبت‌نام"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-card py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary-glow mb-4">
            <ArrowLeft className="ml-2" />
            بازگشت به صفحه اصلی
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            ثبت‌نام در نمایشگاه
          </h1>
          <p className="text-xl text-muted-foreground">
            نمایشگاه تخصصی صنعت آسانسور و پله برقی
          </p>
        </div>

        {step === "type" && <TypeSelection />}
        {step === "phone" && <PhoneVerification />}
        {step === "otp" && <OTPVerification />}
        {step === "form" && <RegistrationForm />}
      </div>
    </div>
  );
};

export default Register;