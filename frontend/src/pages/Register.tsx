import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  FileCheck,
  TriangleAlert,
  UploadCloud,
  User,
  GraduationCap,
  Lock,
  FileText,
} from 'lucide-react';
import { AuthShell } from '../components/layout/AuthShell';
import { Field, inputClasses, selectClasses } from '../components/common/Field';
import { Button } from '../components/common/Button';
import { useLibraryData } from '../context/LibraryDataContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils/cn';

interface RegisterFormData {
  // Step 1: Personal Info
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;

  // Step 2: Student Info
  studentId: string;
  school: string;
  course: string;
  yearLevel: string;

  // Step 3: Account Info
  username: string;
  password: string;
  confirmPassword: string;

  // Step 4: Identification & Agreements
  schoolIdFileName: string;
  schoolIdPreviewUrl: string;
  profilePhotoFileName: string;
  profilePhotoPreviewUrl: string;
  termsAgreed: boolean;
  infoAccurateConfirmed: boolean;
}

const STEPS = [
  { id: 1, name: 'Personal Info', icon: User },
  { id: 2, name: 'Student Info', icon: GraduationCap },
  { id: 3, name: 'Account Info', icon: Lock },
  { id: 4, name: 'Verification & Terms', icon: FileText },
];

export function Register() {
  const { registerMember } = useLibraryData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    contactNumber: '',
    email: '',
    address: '',
    studentId: '',
    school: '',
    course: '',
    yearLevel: '1st Year',
    username: '',
    password: '',
    confirmPassword: '',
    schoolIdFileName: '',
    schoolIdPreviewUrl: '',
    profilePhotoFileName: '',
    profilePhotoPreviewUrl: '',
    termsAgreed: false,
    infoAccurateConfirmed: false,
  });

  const updateField = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, field: 'schoolId' | 'profilePhoto') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (field === 'schoolId') {
      setFormData((prev) => ({
        ...prev,
        schoolIdFileName: file.name,
        schoolIdPreviewUrl: previewUrl,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        profilePhotoFileName: file.name,
        profilePhotoPreviewUrl: previewUrl,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    setError('');
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('First Name and Last Name are required.');
        return false;
      }
      if (!formData.email.trim()) {
        setError('Email Address is required.');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address.');
        return false;
      }
      if (!formData.contactNumber.trim()) {
        setError('Contact Number is required.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!formData.studentId.trim()) {
        setError('Student ID / School ID is required.');
        return false;
      }
      if (!formData.school.trim()) {
        setError('School/Institution name is required.');
        return false;
      }
      if (!formData.course.trim()) {
        setError('Course/Program is required.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!formData.username.trim() && !formData.email.trim()) {
        setError('Username or Email is required.');
        return false;
      }
      if (!formData.password) {
        setError('Password is required.');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (!formData.schoolIdFileName && !formData.schoolIdPreviewUrl) {
        setError('Please upload a copy of your School ID for verification.');
        return false;
      }
      if (!formData.termsAgreed) {
        setError('You must agree to the Library Terms and Conditions.');
        return false;
      }
      if (!formData.infoAccurateConfirmed) {
        setError('You must confirm that the information provided is accurate.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');

    const result = registerMember({
      name: fullName,
      email: formData.email,
      password: formData.password,
      username: formData.username || formData.email.split('@')[0],
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      contactNumber: formData.contactNumber,
      address: formData.address,
      studentId: formData.studentId,
      school: formData.school,
      course: formData.course,
      yearLevel: formData.yearLevel,
      schoolIdUrl: formData.schoolIdPreviewUrl || 'uploaded_id_placeholder.jpg',
      profilePhotoUrl: formData.profilePhotoPreviewUrl || undefined,
      termsAgreed: formData.termsAgreed,
      infoAccurateConfirmed: formData.infoAccurateConfirmed,
    });

    if (!result.ok) {
      setError(result.error ?? 'Unable to complete member registration.');
      return;
    }

    showToast('Registration submitted! Your membership is now pending approval.', 'success');
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <AuthShell
        headline="Registration Submitted."
        tagline="Your membership request has been logged and is awaiting approval by the library administrator."
        title="Application Received"
        subtitle="Account Status: PENDING APPROVAL"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 ring-8 ring-amber-50">
            <Clock className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-ink">Thank you for registering, {formData.firstName}!</h3>
            <p className="text-sm text-muted">
              Newly registered member accounts require administrator approval before becoming active.
            </p>
          </div>

          {/* Workflow Stepper Diagram */}
          <div className="w-full rounded-2xl border border-line bg-surface p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Membership Approval Lifecycle</p>
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>1. Submit Registration Details</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600 font-bold bg-amber-50 p-2 rounded-lg border border-amber-200">
                <Clock className="h-4 w-4 shrink-0" />
                <span>2. Pending Approval (Current Status)</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <span className="h-4 w-4 rounded-full border border-line flex items-center justify-center text-[10px] font-bold">3</span>
                <span>3. Admin Reviews & Approves Application</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <span className="h-4 w-4 rounded-full border border-line flex items-center justify-center text-[10px] font-bold">4</span>
                <span>4. Digital Library Card & QR Code Generated</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <span className="h-4 w-4 rounded-full border border-line flex items-center justify-center text-[10px] font-bold">5</span>
                <span>5. Account Activated → Sign In & Access Portal</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-3 pt-2">
            <Button onClick={() => navigate('/login')} className="w-full justify-center">
              Go to Login Page
            </Button>
            <p className="text-xs text-muted">
              Need assistance? Contact the library desk or email administrator.
            </p>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      headline="Join the Library."
      tagline="Create your member account to access books, reserve titles, track loans, and get your digital QR card."
      title="Member Registration"
      subtitle="Complete the multi-step registration form below."
      footer={
        <>
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-primary-700 hover:text-primary-800">
            Sign in
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Progress Indicator Bar */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-xs font-medium text-muted">{STEPS[currentStep - 1].name}</span>
          </div>

          {/* Stepper Dots & Line */}
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-line" />
            <div
              className="absolute left-0 top-1/2 -z-10 h-0.5 -translate-y-1/2 bg-primary-600 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />

            {STEPS.map((step) => {
              const Icon = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (step.id < currentStep || validateStep(currentStep)) {
                      setCurrentStep(step.id);
                    }
                  }}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all shadow-sm',
                    isCompleted
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : isCurrent
                      ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      : 'border border-line bg-surface text-muted hover:border-primary-400',
                  )}
                  title={step.name}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-700 border border-red-200" role="alert">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PERSONAL INFORMATION */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-line pb-2">
                <h3 className="text-base font-semibold text-ink">Personal Information</h3>
                <p className="text-xs text-muted">Provide your legal name and contact details.</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="First Name" htmlFor="firstName" required>
                  <input
                    id="firstName"
                    type="text"
                    className={inputClasses}
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="Juan"
                  />
                </Field>

                <Field label="Middle Name" htmlFor="middleName">
                  <input
                    id="middleName"
                    type="text"
                    className={inputClasses}
                    value={formData.middleName}
                    onChange={(e) => updateField('middleName', e.target.value)}
                    placeholder="Dela"
                  />
                </Field>

                <Field label="Last Name" htmlFor="lastName" required>
                  <input
                    id="lastName"
                    type="text"
                    className={inputClasses}
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Cruz"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Date of Birth" htmlFor="dateOfBirth">
                  <input
                    id="dateOfBirth"
                    type="date"
                    className={inputClasses}
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  />
                </Field>

                <Field label="Gender" htmlFor="gender">
                  <select
                    id="gender"
                    className={selectClasses}
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Contact Number" htmlFor="contactNumber" required>
                  <input
                    id="contactNumber"
                    type="tel"
                    className={inputClasses}
                    value={formData.contactNumber}
                    onChange={(e) => updateField('contactNumber', e.target.value)}
                    placeholder="0917 123 4567"
                  />
                </Field>

                <Field label="Email Address" htmlFor="email" required>
                  <input
                    id="email"
                    type="email"
                    className={inputClasses}
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="juan.cruz@example.com"
                  />
                </Field>
              </div>

              <Field label="Complete Address" htmlFor="address">
                <textarea
                  id="address"
                  rows={2}
                  className={cn(inputClasses, 'resize-none')}
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Street, Barangay, City/Municipality, Province"
                />
              </Field>
            </div>
          )}

          {/* STEP 2: STUDENT INFORMATION */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-line pb-2">
                <h3 className="text-base font-semibold text-ink">Student Information</h3>
                <p className="text-xs text-muted">Details about your academic institution.</p>
              </div>

              <Field label="Student ID / School ID Number" htmlFor="studentId" required>
                <input
                  id="studentId"
                  type="text"
                  className={inputClasses}
                  value={formData.studentId}
                  onChange={(e) => updateField('studentId', e.target.value)}
                  placeholder="e.g. 2026-01234"
                />
              </Field>

              <Field label="School / Institution" htmlFor="school" required>
                <input
                  id="school"
                  type="text"
                  className={inputClasses}
                  value={formData.school}
                  onChange={(e) => updateField('school', e.target.value)}
                  placeholder="e.g. Balingasag National High School / State University"
                />
              </Field>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Course / Program / Strand" htmlFor="course" required>
                  <input
                    id="course"
                    type="text"
                    className={inputClasses}
                    value={formData.course}
                    onChange={(e) => updateField('course', e.target.value)}
                    placeholder="e.g. BS Information Technology"
                  />
                </Field>

                <Field label="Year Level" htmlFor="yearLevel" required>
                  <select
                    id="yearLevel"
                    className={selectClasses}
                    value={formData.yearLevel}
                    onChange={(e) => updateField('yearLevel', e.target.value)}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Faculty / Staff">Faculty / Staff</option>
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* STEP 3: ACCOUNT INFORMATION */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-line pb-2">
                <h3 className="text-base font-semibold text-ink">Account Credentials</h3>
                <p className="text-xs text-muted">Set up your portal login credentials.</p>
              </div>

              <Field label="Username or Email" htmlFor="username" required>
                <input
                  id="username"
                  type="text"
                  className={inputClasses}
                  value={formData.username || formData.email}
                  onChange={(e) => updateField('username', e.target.value)}
                  placeholder="Choose a username"
                />
              </Field>

              <Field label="Password" htmlFor="password" required>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={cn(inputClasses, 'pr-10')}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted hover:text-ink"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <Field label="Confirm Password" htmlFor="confirmPassword" required>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className={inputClasses}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="Re-enter your password"
                />
              </Field>
            </div>
          )}

          {/* STEP 4: IDENTIFICATION & AGREEMENT */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-line pb-2">
                <h3 className="text-base font-semibold text-ink">Identification & Agreements</h3>
                <p className="text-xs text-muted">Upload proof of identity and accept terms.</p>
              </div>

              {/* Upload School ID */}
              <Field label="Upload School ID (Required)" htmlFor="schoolId" required>
                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-surface p-4 text-center hover:border-primary-400">
                  <UploadCloud className="h-7 w-7 text-muted" />
                  <p className="mt-1 text-xs font-medium text-ink">
                    {formData.schoolIdFileName ? formData.schoolIdFileName : 'Click to select or drag & drop School ID file'}
                  </p>
                  <p className="text-[10px] text-muted">PNG, JPG, or PDF up to 5MB</p>
                  <input
                    id="schoolId"
                    type="file"
                    accept="image/*,.pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFileUpload(e, 'schoolId')}
                  />
                </div>
              </Field>

              {/* Upload Profile Photo */}
              <Field label="Profile Photo (Optional)" htmlFor="profilePhoto">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface text-muted">
                    {formData.profilePhotoPreviewUrl ? (
                      <img src={formData.profilePhotoPreviewUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      className="text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                      onChange={(e) => handleFileUpload(e, 'profilePhoto')}
                    />
                    <p className="mt-1 text-[10px] text-muted">Upload a clear front-facing profile photo for your library card.</p>
                  </div>
                </div>
              </Field>

              {/* Agreements */}
              <div className="mt-2 space-y-3 rounded-xl border border-line bg-surface p-4">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.termsAgreed}
                    onChange={(e) => updateField('termsAgreed', e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-line text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs text-ink">
                    I agree to the <strong className="font-semibold text-primary-700">Library Terms and Conditions</strong> and rules regarding borrowing, conduct, and penalties.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.infoAccurateConfirmed}
                    onChange={(e) => updateField('infoAccurateConfirmed', e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-line text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs text-ink">
                    I confirm that all personal and student information provided is accurate and truthful.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-3">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : <div />}

            {currentStep < STEPS.length ? (
              <Button type="button" onClick={handleNext} className="gap-2">
                Next Step
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                Submit Registration
                <FileCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
