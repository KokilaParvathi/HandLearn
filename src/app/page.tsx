'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Video, GraduationCap, Trophy, CheckCircle2,
  ChevronRight, Play, Languages, Menu, X,
  Home, Award, Library, Brain, Hand, Sparkles,
  Heart, Sun, Clock, Users, UserCheck, Search, Eye,
  MessageSquare, Target, Send, Plus, UserCircle, Smile,
  Paperclip, Video as VideoIcon, Phone, MoreVertical,
  ThumbsUp, XCircle, HelpCircle, CheckCircle,
  Image as ImageIcon, Download, Share2, Filter,
  LogOut, Lock, Unlock, Bell, Star, Calendar,
  TrendingUp, BarChart3, BookMark, Globe
} from 'lucide-react';

type Language = 'en' | 'mr';
type UserRole = 'student' | 'teacher';
type TabType = 'home' | 'courses' | 'sign-language' | 'quiz' | 'vocabulary' | 'progress' | 'teacher-dashboard' | 'buddy-chat' | 'login';
type QuizCategory = 'basics' | 'intermediate' | 'advanced' | 'marathi' | 'practical' | 'emotions' | 'numbers' | 'daily-life';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar: string;
  progress: number;
  level: string;
  totalQuizScore: number;
  lessonsCompleted: number;
  lastActive: string;
}

interface Course {
  id: number;
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  level: string;
  duration: string;
  lessons: number;
  icon: React.ReactNode;
  color: string;
  progress: number;
  youtubeVideo?: string;
  images?: string[];
  rating: number;
  enrolled: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  questionMr: string;
  options: string[];
  optionsMr: string[];
  correctAnswer: number;
  image?: string;
  category: QuizCategory;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface VocabularyWord {
  id: number;
  word: string;
  wordMr: string;
  translation: string;
  category: string;
  categoryMr: string;
  icon: React.ReactNode;
  image: string;
}

interface Buddy {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  level: string;
  lastSeen: string;
  progress: number;
  email: string;
  coursesCompleted: number;
  totalQuizzes: number;
  quizScore: number;
}

interface ChatMessage {
  id: number;
  buddyId: number;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
  read: boolean;
  type: 'text' | 'image' | 'video' | 'help';
}

export default function LearningPlatform() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedQuizCategory, setSelectedQuizCategory] = useState<QuizCategory>('basics');
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('student');
  
  // Chat states
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<number, ChatMessage[]>>({});
  const [typingBuddies, setTypingBuddies] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Teacher states for creating content
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    titleMr: '',
    description: '',
    descriptionMr: '',
    level: 'Beginner',
    duration: '2 weeks',
    youtubeVideo: '',
    image: ''
  });
  const [newQuiz, setNewQuiz] = useState({
    question: '',
    questionMr: '',
    options: ['', '', '', '', ''],
    optionsMr: ['', '', '', '', ''],
    correctAnswer: 0,
    category: 'basics' as QuizCategory,
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    image: ''
  });

  // Course data with videos
  const courses: Course[] = [
    {
      id: 1,
      title: 'Basic Sign Language',
      titleMr: 'मूलभूत सांकेतिक भाषा',
      description: 'Learn fundamental signs for daily communication',
      descriptionMr: 'दैनंदिन संवादासाठी मूलभूत संकेत शिका',
      level: 'Beginner',
      duration: '4 weeks',
      lessons: 12,
      icon: <Hand className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-600',
      progress: 85,
      youtubeVideo: 'https://www.youtube.com/watch?v=v1desDduz5M',
      images: ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800'],
      rating: 4.8,
      enrolled: true
    },
    {
      id: 2,
      title: 'Alphabet & Numbers',
      titleMr: 'वर्णमाला आणि अंक',
      description: 'Master finger spelling and number signs',
      descriptionMr: 'बोटे वापरून अक्षरे आणि अंक दाखवणे शिका',
      level: 'Beginner',
      duration: '2 weeks',
      lessons: 8,
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600',
      progress: 100,
      youtubeVideo: 'https://www.youtube.com/watch?v=0LIV0miyxR8',
      images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'],
      rating: 4.9,
      enrolled: true
    },
    {
      id: 3,
      title: 'Everyday Phrases',
      titleMr: 'दैनंदिन वाक्ये',
      description: 'Common expressions and sentences',
      descriptionMr: 'सामान्य व्यक्ती आणि वाक्ये',
      level: 'Intermediate',
      duration: '3 weeks',
      lessons: 10,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600',
      progress: 65,
      youtubeVideo: 'https://www.youtube.com/watch?v=lC_DCrDJSeQ',
      images: ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800'],
      rating: 4.7,
      enrolled: true
    },
    {
      id: 4,
      title: 'Marathi Sign Language',
      titleMr: 'मराठी सांकेतिक भाषा',
      description: 'Learn signs specific to Marathi language',
      descriptionMr: 'मराठी भाषेसाठी विशिष्ट संकेत शिका',
      level: 'Intermediate',
      duration: '5 weeks',
      lessons: 15,
      icon: <Globe className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      progress: 45,
      youtubeVideo: 'https://www.youtube.com/watch?v=OK7ppVdau8M',
      images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'],
      rating: 4.6,
      enrolled: true
    },
    {
      id: 5,
      title: 'Advanced Communication',
      titleMr: 'प्रगत संवाद',
      description: 'Complex conversations and expressions',
      descriptionMr: 'गुंतागुंती चे संभाषण आणि व्यक्ती',
      level: 'Advanced',
      duration: '6 weeks',
      lessons: 20,
      icon: <Brain className="w-6 h-6" />,
      color: 'from-rose-500 to-pink-600',
      progress: 30,
      youtubeVideo: 'https://www.youtube.com/embed/LsC9e2d7T0k',
      images: ['https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800'],
      rating: 4.5,
      enrolled: false
    },
    {
      id: 6,
      title: 'Emotions & Feelings',
      titleMr: 'भावना आणि भावना',
      description: 'Express emotions through sign language',
      descriptionMr: 'सांकेतिक भाषेद्वारे भावना',
      level: 'Intermediate',
      duration: '4 weeks',
      lessons: 12,
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600',
      progress: 55,
      youtubeVideo: 'https://www.youtube.com/embed/l6p2vq4rE8',
      images: ['https://images.unsplash.com/photo-151819926679-5375a83190b7?w=800'],
      rating: 4.7,
      enrolled: true
    },
    {
      id: 7,
      title: 'Numbers & Counting',
      titleMr: 'अंक आणि मोजणी',
      description: 'Learn to count and sign numbers',
      descriptionMr: 'मोजणे करण आणि अंक दाखवणे शिका',
      level: 'Beginner',
      duration: '3 weeks',
      lessons: 10,
      icon: <Target className="w-6 h-6" />,
      color: 'from-indigo-500 to-violet-600',
      progress: 90,
      youtubeVideo: 'https://www.youtube.com/embed/8J4g8k2jQhY',
      images: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800'],
      rating: 4.8,
      enrolled: true
    },
    {
      id: 8,
      title: 'Daily Life Signs',
      titleMr: 'दैनंदिन जीवनाचे संकेत',
      description: 'Practical signs for everyday situations',
      descriptionMr: 'दैनंदिन जीवनाचे संकेत',
      level: 'Advanced',
      duration: '5 weeks',
      lessons: 18,
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-teal-500 to-cyan-600',
      progress: 25,
      youtubeVideo: 'https://www.youtube.com/embed/m4j5q7b7dV8',
      images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
      rating: 4.9,
      enrolled: true
    }
  ];

  // Extended quiz questions - 40 total
  const allQuizQuestions: Record<QuizCategory, QuizQuestion[]> = {
    basics: [
      {
        id: 1,
        question: 'What is the sign for "Hello"?',
        questionMr: '"नमस्कार" चे संकेत काय आहे?',
        options: ['Wave hand', 'Tap shoulder', 'Bow head', 'Clap hands'],
        optionsMr: ['हात हलवा', 'खांद्यावर टॅप करा', 'डोके वाकडा करा', 'ताळ्या वाजवा'],
        correctAnswer: 0,
        category: 'basics',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'How do you sign "Thank You"?',
        questionMr: '"धन्यवाद" कसे साइन करता?',
        options: ['Point to chest', 'Touch chin', 'Blow kiss', 'Thumbs up'],
        optionsMr: ['छातीवर बोट दाखवा', 'डोळ्यांना स्पर्श करा', 'चुंबन फुंका'],
        correctAnswer: 1,
        category: 'basics',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'What represents "Yes" in sign language?',
        questionMr: 'सांकेतिक भाषेत "होय" काय दर्शवते?',
        options: ['Shake head', 'Nod head', 'Wave hand', 'Snap fingers'],
        optionsMr: ['डोके हलवा', 'डोके वाकडा', 'हात हलवा', 'बोटे मिरववा'],
        correctAnswer: 1,
        category: 'basics',
        difficulty: 'easy'
      },
      {
        id: 4,
        question: 'How do you indicate "No"?',
        questionMr: '"नाही" कसे दर्शवता?',
        options: ['Nod head', 'Shake head', 'Close eyes', 'Hands up'],
        optionsMr: ['डोके हलवा', 'डोके वाकडा', 'हात वर करा'],
        correctAnswer: 1,
        category: 'basics',
        difficulty: 'easy'
      },
      {
        id: 5,
        question: 'What is the sign for "Good"?',
        questionMr: '"चांगले" चे संकेत काय आहे?',
        options: ['Thumbs down', 'Thumbs up', 'Peace sign', 'OK sign'],
        optionsMr: ['बोट खाली', 'बोट वर', 'शांत चिन्ह', 'ठीक आहे चिन्ह'],
        correctAnswer: 1,
        category: 'basics',
        difficulty: 'easy'
      }
    ],
    numbers: [
      {
        id: 6,
        question: 'How do you sign the number "5"?',
        questionMr: '"५" (पाँच) हे संकेत करता?',
        options: ['Five fingers', 'Open palm five times', 'One hand with 5 fingers', 'Both hands show 5'],
        optionsMr: ['पाँच बोट', 'उघडा हात ५ वेळा', 'एका हात खाली', 'दोन हात वर', 'बोट वर', 'सपाट हात वराव दोट', 'एक हात खाली', 'दोन हात वर'],
        correctAnswer: 2,
        category: 'numbers',
        difficulty: 'easy'
      },
      {
        id: 7,
        question: 'How do you sign "10"?',
        questionMr: '"१०" (दहा) हे संकेत करता?',
        options: ['Thumb up twice', 'Two thumbs up', 'Index and middle up', 'Show all fingers twice'],
        optionsMr: ['अंगठा वर', 'बोट वर', 'सपाट हात वर', 'कपाळ वर', 'व्यार', 'दोन हात वर', 'छातीला स्पर्श करा', 'बोट वर', 'ग्राउस करा'],
        correctAnswer: 0,
        category: 'numbers',
        difficulty: 'medium'
      },
      {
        id: 8,
        question: 'What is the sign for "100"?',
        questionMr: '"१०" (शंभरी) हे संकेत काय आहे?',
        options: ['Show 1 twice then 0', 'Wave hand three times', 'Clap hands', 'Both hands show 10'],
        optionsMr: ['ध० खावा', 'हात हलवा', 'चुंबन फुंका', 'बोट वर', 'सपाट हात वर', 'दोन हात वर'],
        correctAnswer: 1,
        category: 'numbers',
        difficulty: 'hard'
      },
      {
        id: 9,
        question: 'What is the sign for "First"?',
        questionMr: '"पहिले" हे संकेत कसे विचारता?',
        options: ['Index finger up', 'Thumb up alone', 'Point forward', 'One hand palm forward'],
        optionsMr: ['तर्जा बोट', 'पुढे बोट दाखवा', 'कपाळ वर', 'स्वतः कडे बोट'],
        correctAnswer: 0,
        category: 'numbers',
        difficulty: 'easy'
      },
      {
        id: 10,
        question: 'What is the sign for "Zero"?',
        questionMr: '"०" (शून्य) हे संकेत काय आहे?',
        options: ['Fist closed', 'Hand in circle', 'Thumb to fingers', 'Cross fingers'],
        optionsMr: ['मुठ्ठी छाती वर', 'चुंबन फुंका', 'हात हलवा', 'बोटे मिरव'],
        correctAnswer: 0,
        category: 'numbers',
        difficulty: 'easy'
      }
    ],
    emotions: [
      {
        id: 11,
        question: 'How do you sign "Happy"?',
        questionMr: '"आनंद" हे संकेत कसे र्ता?',
        options: ['Big smile', 'Clap hands', 'Thumbs up', 'Open arms wide'],
        optionsMr: ['मोठा हस', 'ताळ्या वाजवा', 'हसा', 'बोटे मिरव'],
        correctAnswer: 0,
        category: 'emotions',
        difficulty: 'easy'
      },
      {
        id: 12,
        question: 'How do you sign "Sad"?',
        questionMr: '"दुःखी" हे संकेत कसे र्ता?',
        options: ['Frown', 'Wipe eyes', 'Drop shoulders', 'Hands down'],
        optionsMr: ['आंबूदृश', 'सपाव खाली', 'हात वर करा'],
        correctAnswer: 0,
        category: 'emotions',
        difficulty: 'easy'
      },
      {
        id: 13,
        question: 'How do you express "Angry"?',
        questionMr: '"रागी" कसे व्यक्त करता?',
        options: ['Fist on chest', 'Point down sharply', 'Forehead wrinkle', 'Hands on hips'],
        optionsMr: ['मुठ्ठी वर मुठ', 'खाली नीचे बोट', 'कपाळा वर', 'सपाट हात वर'],
        correctAnswer: 0,
        category: 'emotions',
        difficulty: 'medium'
      },
      {
        id: 14,
        question: 'What represents "Surprised"?',
        questionMr: '"आश्चर्य" कसे दर्शवते?',
        options: ['Hands on cheeks', 'Open mouth wide', 'Step back'],
        optionsMr: ['गालांव र मुठा', 'सपाट हात वर', 'समज'],
        correctAnswer: 0,
        category: 'emotions',
        difficulty: 'easy'
      },
      {
        id: 15,
        question: 'How do you show "Excited"?',
        questionMr: '"उत्साहित" कसे दर्शवता?',
        options: ['Bounce hands', 'Big smile', 'Clap repeatedly', 'Jump in place'],
        optionsMr: ['हात हलवा', 'थोड वर', 'मागे हस', 'मीर'],
        correctAnswer: 1,
        category: 'emotions',
        difficulty: 'easy'
      }
    ],
    dailyLife: [
      {
        id: 16,
        question: 'How to ask "Where is the bathroom?"',
        questionMr: '"बाथरूम कुठे आहे?" कसे विचारता?',
        options: ['Make T sign', 'Wave hand', 'Point randomly', 'Look confused'],
        optionsMr: ['T चिन्ह करा', 'हात व', 'गोंधाले पाहा'],
        correctAnswer: 0,
        category: 'daily-life',
        difficulty: 'easy'
      },
      {
        id: 17,
        question: 'How to sign "I am hungry"?',
        questionMr: '"मला भूक लागली आहे" कसे साइन करता?',
        options: ['Stomach motion', 'Touch mouth', 'Hands on stomach', 'Rub belly'],
        optionsMr: ['पोटाची हालचाल', 'सपाट हात वर', 'मागे'],
        correctAnswer: 2,
        category: 'daily-life',
        difficulty: 'easy'
      },
      {
        id: 18,
        question: 'What is the sign for "Water"?',
        questionMr: '"पाणी" चे संकेत काय आहे?',
        options: ['W sign', 'Three fingers', 'Open palm', 'Thumb to chin'],
        optionsMr: ['पाणी', 'सपाट हात', 'वर'],
        correctAnswer: 0,
        category: 'daily-life',
        difficulty: 'easy'
      },
      {
        id: 19,
        question: 'How do you say "I am thirsty"?',
        questionMr: '"मला तहान लागली आहे" कसे म्हणता?',
        options: ['Touch throat', 'Tongue out', 'Palm to mouth', 'Wipe mouth'],
        optionsMr: ['घशाला स्पर्श', 'सपाट हात'],
        correctAnswer: 0,
        category: 'daily-life',
        difficulty: 'medium'
      },
      {
        id: 20,
        question: 'What time is it?"',
        questionMr: '"किती वेळ" आहे?"',
        options: ['Point to wrist', 'Tap shoulder', 'Make circle', 'Point to sky'],
        optionsMr: ['नकाळावर बोट', 'सपाट', 'वर'],
        correctAnswer: 0,
        category: 'daily-life',
        difficulty: 'easy'
      }
    ],
    intermediate: [
      {
        id: 21,
        question: 'How do you sign "Please"?',
        questionMr: '"कृपया" कसे साइन करता?',
        options: ['Rub chest', 'Flat hand on chest', 'Touch forehead', 'Wave both hands'],
        optionsMr: ['छाती घासा', 'छाती वर', 'कपाळाव र'],
        correctAnswer: 1,
        category: 'intermediate',
        difficulty: 'medium'
      },
      {
        id: 22,
        question: 'What is the sign for "Sorry"?',
        questionMr: '"माफी" चे संकेत काय आहे?',
        options: ['Fist on chest', 'Open hand on chest', 'Touch nose', 'Bows head'],
        optionsMr: ['मुठ्ठी छातीवर', 'कपाळा वर'],
        correctAnswer: 0,
        category: 'intermediate',
        difficulty: 'easy'
      },
      {
        id: 23,
        question: 'How to sign "Excuse Me"?',
        questionMr: '"क्षमा करा" कसे साइन करता?',
        options: ['Wave hand', 'Touch shoulder', 'Raise hand slightly', 'Point to self'],
        optionsMr: ['हात हलवा', 'कपाळ वर', 'स्वतः कडे बोट'],
        correctAnswer: 2,
        category: 'intermediate',
        difficulty: 'medium'
      },
      {
        id: 24,
        question: 'What represents "Love" in sign language?',
        questionMr: '"प्रेम" कसे दर्शवते?',
        options: ['Heart with hands', 'Cross arms', 'Hands on heart', 'Blow kiss'],
        optionsMr: ['हृदयांनी', 'हात वर', 'कृ क्रो उस करा', 'बोट'],
        correctAnswer: 2,
        category: 'intermediate',
        difficulty: 'medium'
      },
      {
        id: 25,
        question: 'How do you sign "Help"?',
        questionMr: '"मदत" कसे साइन करता?',
        options: ['One hand up', 'Thumbs up', 'Flat hand raised', 'Both hands up'],
        optionsMr: ['एक हात वर', 'सपाट हात वर', 'दोन हात वर'],
        correctAnswer: 2,
        category: 'intermediate',
        difficulty: 'easy'
      }
    ],
    advanced: [
      {
        id: 26,
        question: 'How do you sign "Congratulations"?',
        questionMr: '"अभिनंदन" कसे साइन करता?',
        options: ['Clap hands', 'Both thumbs up', 'Wave both hands', 'Pat back'],
        optionsMr: ['ताळ्या वाजवा', 'कपाळा वर', 'घोवार'],
        correctAnswer: 1,
        category: 'advanced',
        difficulty: 'medium'
      },
      {
        id: 27,
        question: 'What is the sign for "Understanding"?',
        questionMr: '"समज" चे संकेत काय आहे?',
        options: ['Point to head', 'Tap forehead', 'Hand near forehead', 'Both hands on head'],
        optionsMr: ['डोक्याला', 'वराकड', 'पाळावर', 'ज'],
        correctAnswer: 2,
        category: 'advanced',
        difficulty: 'hard'
      },
      {
        id: 28,
        question: 'How to sign "Patience"?',
        questionMr: '"धीर" कसे साइन करता?',
        options: ['Folded hands', 'Hand moving slowly', 'Flat hand down', 'Finger to lips'],
        optionsMr: ['हात गुंडाळे', 'सपाट हात', 'बोट ओठांवर'],
        correctAnswer: 1,
        category: 'advanced',
        difficulty: 'hard'
      },
      {
        id: 29,
        question: 'What represents "Friendship" in sign language?',
        questionMr: '"मैत्री" कसे दर्श्वते?',
        options: ['Handshake motion', 'Interlinked fingers', 'Arms around shoulders', 'Hands together'],
        optionsMr: ['हॅंडशेक मोशन बोट', 'ग्राउस करा', 'सपाळा हात'],
        correctAnswer: 1,
        category: 'advanced',
        difficulty: 'medium'
      },
      {
        id: 30,
        question: 'How do you sign "Respect"?',
        questionMr: '"आदर" कसे साइन करता?',
        options: ['Bows', 'Hand from heart outward', 'Salute', 'Hands prayer position'],
        optionsMr: ['वाकडा', 'हृ दयार', 'सलामी', 'हात प्रार्थना'],
        correctAnswer: 1,
        category: 'advanced',
        difficulty: 'hard'
      }
    ],
    marathi: [
      {
        id: 31,
        question: '"नमस्कार" (Namaste) कसे साइन करता?',
        options: ['Hands together prayer', 'Wave hand', 'Touch feet', 'Bow head'],
        optionsMr: ['हात एकत्र प्रार्थना', 'हात हात', 'घ'],
        correctAnswer: 0,
        category: 'marathi',
        difficulty: 'easy'
      },
      {
        id: 32,
        question: '"धन्यवाद" (Dhanyavad) कसे साइन करता?',
        options: ['Touch chin', 'Wave hand', 'Hands up', 'Touch chest'],
        optionsMr: ['छातीला स्पर्श', 'कपाळ वर'],
        correctAnswer: 0,
        category: 'marathi',
        difficulty: 'easy'
      },
      {
        id: 33,
        question: '"माफी" (Maafi) चे संकेत काय आहे?',
        options: ['Fist on chest', 'Wave hand', 'Thumbs down', 'Touch nose'],
        optionsMr: ['मुठ्ठी छाती वर'],
        correctAnswer: 0,
        category: 'marathi',
        difficulty: 'easy'
      },
      {
        id: 34,
        question: '"प्रेम" (Prem) कसे साइन करता?',
        options: ['Hands on heart', 'Wave both hands', 'Fingers crossed', 'Touch head'],
        optionsMr: ['हृदयांनी हात', 'सपाट हात वर'],
        correctAnswer: 0,
        category: 'marathi',
        difficulty: 'easy'
      },
      {
        id: 35,
        question: '"मदत" (Madat) कसे मागता?',
        options: ['Both hands up', 'One hand down', 'Wave hand', 'Clap'],
        optionsMr: ['दोन हात वर', 'कपाळ वर', 'हात वर'],
        correctAnswer: 0,
        category: 'marathi',
        difficulty: 'easy'
      }
    ],
    practical: [
      {
        id: 36,
        question: 'How to ask "What is your name?" in sign language?',
        questionMr: '"तुमचे नाव काय?" कसे विचारता?',
        options: ['Point then sign name', 'Wave hand', 'Touch chest', 'Both hands out'],
        optionsMr: ['बोट नंतर नाव साइन', 'कपाळ वर'],
        correctAnswer: 0,
        category: 'practical',
        difficulty: 'easy'
      },
      {
        id: 37,
        question: 'How to sign "How are you?"',
        questionMr: '"तुम्ही कसे आहात?" कसे विचारता?',
        options: ['Wave both hands', 'Nod head', 'Thumbs up', 'Point to chest'],
        optionsMr: ['दोन हात हलवा', 'वर'],
        correctAnswer: 1,
        category: 'practical',
        difficulty: 'easy'
      },
      {
        id: 38,
        question: 'How do you say "I am fine"?',
        questionMr: '"मी ठीक आहे" कसे म्हणता?',
        options: ['Thumbs up', 'Wave hand', 'Touch chest', 'Both thumbs up'],
        optionsMr: ['दोन हात वर', 'सपाट हात वर'],
        correctAnswer: 0,
        category: 'practical',
        difficulty: 'easy'
      },
      {
        id: 39,
        question: 'How to sign "Nice to meet you"?',
        questionMr: '"भेटवे आठे साइन करता?',
        options: ['Shake hands', 'Bow slightly', 'Smile', 'Hand on chest'],
        optionsMr: ['हात हलवा', 'वर'],
        correctAnswer: 0,
        category: 'practical',
        difficulty: 'medium'
      },
      {
        id: 40,
        question: 'How to sign "See you later"?',
        questionMr: '"तुम्ही संशयात?" कसे विचारता?',
        options: ['Wave hand', 'Point forward', 'Wink', 'Peace sign'],
        optionsMr: ['हात हलवा', 'वर'],
        correctAnswer: 0,
        category: 'practical',
        difficulty: 'easy'
      }
    ]
  };

  // Vocabulary with images
  const vocabularyWords: VocabularyWord[] = [
    { 
      id: 1, 
      word: 'Hello', 
      wordMr: 'नमस्कार', 
      translation: 'नमस्कार / Hello', 
      category: 'Greetings', 
      categoryMr: 'अभिवादन', 
      icon: <Hand className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800'
    },
    { 
      id: 2, 
      word: 'Thank you', 
      wordMr: 'धन्यवाद', 
      translation: 'धन्यवाद / Thank you', 
      category: 'Greetings', 
      categoryMr: 'अभिवादन', 
      icon: <ThumbsUp className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800'
    },
    { 
      id: 3, 
      word: 'Family', 
      wordMr: 'कुटुंब', 
      translation: 'कुटुंब / Family', 
      category: 'Basics', 
      categoryMr: 'मूलभूत', 
      icon: <Users className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800'
    },
    { 
      id: 4, 
      word: 'School', 
      wordMr: 'शाळा', 
      translation: 'शाळा / School', 
      category: 'Education', 
      categoryMr: 'शिक्षण', 
      icon: <GraduationCap className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'
    },
    { 
      id: 5, 
      word: 'Water', 
      wordMr: 'पाणी', 
      translation: 'पाणी / Water', 
      category: 'Daily Life', 
      categoryMr: 'दैनंदिन जीवन', 
      icon: <Sparkles className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800'
    },
    { 
      id: 6, 
      word: 'Food', 
      wordMr: 'अन्न', 
      translation: 'अन्न / Food', 
      category: 'Daily Life', 
      categoryMr: 'दैनंदिन जीवन', 
      icon: <Star className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'
    },
    { 
      id: 7, 
      word: 'Help', 
      wordMr: 'मदत', 
      translation: 'मदत / Help', 
      category: 'Communication', 
      categoryMr: 'संवाद', 
      icon: <HelpCircle className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800'
    },
    { 
      id: 8, 
      word: 'Love', 
      wordMr: 'प्रेम', 
      translation: 'प्रेम / Love', 
      category: 'Emotions', 
      categoryMr: 'भावना', 
      icon: <Heart className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-151819926679-5375a83190b7?w=800'
    },
    { 
      id: 9, 
      word: 'Learn', 
      wordMr: 'शिका', 
      translation: 'शिका / Learn', 
      category: 'Education', 
      categoryMr: 'शिक्षण', 
      icon: <BookOpen className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800'
    },
    { 
      id: 10, 
      word: 'Time', 
      wordMr: 'वेळ', 
      translation: 'वेळ / Time', 
      category: 'Daily Life', 
      categoryMr: 'दैनंदिन जीवन', 
      icon: <Clock className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800'
    },
    { 
      id: 11, 
      word: 'Friend', 
      wordMr: 'मित्र', 
      translation: 'मित्र / Friend', 
      category: 'Basics', 
      categoryMr: 'मूलभूत', 
      icon: <UserCircle className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800'
    },
    { 
      id: 12, 
      word: 'Good morning', 
      wordMr: 'शुभ सकाळ', 
      translation: 'शुभ सकाळ / Good morning', 
      category: 'Greetings', 
      categoryMr: 'अभिवादन', 
      icon: <Sun className="w-10 h-10" />,
      image: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800'
    }
  ];

  // Buddy data
  const buddies: Buddy[] = [
    { id: 1, name: 'Priya Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', online: true, level: 'Intermediate', lastSeen: 'Now', progress: 85, email: 'priya@school.edu', coursesCompleted: 3, totalQuizzes: 12, quizScore: 88 },
    { id: 2, name: 'Rahul Patil', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', online: true, level: 'Advanced', lastSeen: 'Now', progress: 92, email: 'rahul@school.edu', coursesCompleted: 4, totalQuizzes: 15, quizScore: 94 },
    { id: 3, name: 'Anita Deshmukh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita', online: false, level: 'Beginner', lastSeen: '2 hours ago', progress: 45, email: 'anita@school.edu', coursesCompleted: 2, totalQuizzes: 8, quizScore: 72 },
    { id: 4, name: 'Vikram Joshi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', online: true, level: 'Advanced', lastSeen: 'Now', progress: 88, email: 'vikram@school.edu', coursesCompleted: 5, totalQuizzes: 18, quizScore: 91 },
    { id: 5, name: 'Meera Kulkarni', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera', online: false, level: 'Intermediate', lastSeen: '1 hour ago', progress: 72, email: 'meera@school.edu', coursesCompleted: 3, totalQuizzes: 10, quizScore: 85 }
  ];

  // Mock students for teacher dashboard
  const students: User[] = [
    { id: '1', name: 'Priya Sharma', email: 'priya@school.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', progress: 85, level: 'Intermediate', totalQuizScore: 88, lessonsCompleted: 32, lastActive: '2 min ago' },
    { id: '2', name: 'Rahul Patil', email: 'rahul@school.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', progress: 92, level: 'Advanced', totalQuizScore: 94, lessonsCompleted: 38, lastActive: 'Now' },
    { id: '3', name: 'Anita Deshmukh', email: 'anita@school.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita', progress: 45, level: 'Beginner', totalQuizScore: 72, lessonsCompleted: 18, lastActive: '1 hour ago' },
    { id: '4', name: 'Vikram Joshi', email: 'vikram@school.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', progress: 88, level: 'Advanced', totalQuizScore: 91, lessonsCompleted: 35, lastActive: 'Just now' },
    { id: '5', name: 'Meera Kulkarni', email: 'meera@school.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera', progress: 72, level: 'Intermediate', totalQuizScore: 85, lastActive: '30 min ago' }
  ];

  const content = {
    en: {
      title: 'Learn Without Limits',
      subtitle: 'Accessible Learning for Deaf and Mute People',
      home: 'Home',
      courses: 'Courses',
      signLanguage: 'Sign Language',
      quiz: 'Quiz',
      vocabulary: 'Vocabulary',
      progress: 'Progress',
      teacherDashboard: 'Teacher Dashboard',
      buddyChat: 'Study Buddies',
      login: 'Login',
      welcome: 'Welcome to SignLearn',
      welcomeDesc: 'The ultimate learning platform for deaf and mute people with video lessons, quizzes, and real-time chat.',
      startLearning: 'Start Learning',
      exploreCourses: 'Explore Courses',
      viewProgress: 'View Progress',
      totalProgress: 'Total Progress',
      lessonsCompleted: 'Lessons Completed',
      achievements: 'Achievements',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      startQuiz: 'Start Quiz',
      nextQuestion: 'Next Question',
      correct: 'Correct!',
      incorrect: 'Try Again',
      practice: 'Practice',
      level: 'Level',
      duration: 'Duration',
      lessons: 'Lessons',
      continue: 'Continue',
      complete: 'Complete',
      watchVideo: 'Watch Video',
      viewImages: 'View Images',
      studentProgress: 'Student Progress',
      manageStudents: 'Manage Students',
      analytics: 'Analytics',
      recentActivity: 'Recent Activity',
      topPerformers: 'Top Performers',
      needsAttention: 'Needs Attention',
      averageProgress: 'Average Progress',
      totalStudents: 'Total Students',
      activeStudents: 'Active Students',
      searchStudent: 'Search students...',
      noStudents: 'No students found',
      studentDetails: 'Student Details',
      performanceHistory: 'Performance History',
      notes: 'Teacher Notes',
      addNote: 'Add Note',
      saveNote: 'Save Note',
      cancel: 'Cancel',
      quizBasics: 'Basics',
      quizIntermediate: 'Intermediate',
      quizAdvanced: 'Advanced',
      quizMarathi: 'Marathi',
      quizPractical: 'Practical Signs',
      quizEmotions: 'Emotions',
      quizNumbers: 'Numbers',
      quizDailyLife: 'Daily Life',
      selectBuddy: 'Select a buddy to chat',
      typeMessage: 'Type your message...',
      send: 'Send',
      online: 'Online',
      offline: 'Offline',
      yourBuddies: 'Your Buddies',
      findBuddy: 'Find New Buddy',
      startConversation: 'Start Conversation',
      typing: 'typing...',
      quizComplete: 'Quiz Complete!',
      youScored: 'You scored',
      tryAgain: 'Try Again',
      perfectScore: 'Perfect Score!',
      keepLearning: 'Keep Learning!',
      loginAsStudent: 'Login as Student',
      loginAsTeacher: 'Login as Teacher',
      email: 'Email',
      password: 'Password',
      loginBtn: 'Login',
      welcomeStudent: 'Welcome back, Student!',
      welcomeTeacher: 'Welcome back, Teacher!',
      studentDashboard: 'Student Dashboard',
      teacherDashboard: 'Teacher Dashboard',
      yourProgress: 'Your Progress',
      coursesCompleted: 'Courses Completed',
      totalQuizzesTaken: 'Total Quizzes',
      averageQuizScore: 'Average Quiz Score',
      recentQuizzes: 'Recent Quizzes',
      myBuddies: 'My Buddies',
      chatWithBuddy: 'Chat with Buddy',
      viewAllStudents: 'View All Students',
      yourBuddies: 'Your Buddies',
      viewAllStudents: 'View All Students',
      studentProgress: 'Student Progress',
      studentDetails: 'Student Details',
      performanceHistory: 'Performance History',
      notes: 'Teacher Notes',
      addNote: 'Add Note',
      saveNote: 'Save Note',
      cancel: 'Cancel'
    },
    mr: {
      title: 'मर्यादित न करा शिक्षण्याचा आनंद',
      subtitle: 'बधिर आणि मूक शिक्षण रा',
      home: 'मुख्यपृष्ठ',
      courses: 'अभ्यासक्रम',
      signLanguage: 'सांकेतिक भाषा',
      quiz: 'क्विझ',
      vocabulary: 'शब्दकोश',
      progress: 'प्रगती',
      teacherDashboard: 'शिक्षक डॅशबोर्ड',
      buddyChat: 'अभ्यासक्रम',
      login: 'लॉगिन',
      welcome: 'स्वागत आहे',
      welcomeDesc: 'बधिर आणि मूक शिक्षण रा व्य करा प्लॅटफॉर्म्वय करतो.',
      startLearning: 'शिकणे सुरू करा',
      exploreCourses: 'अभ्यासक्रम पहा',
      viewProgress: 'प्रगती पहा',
      totalProgress: 'एकूण प्रगती',
      lessonsCompleted: 'पूर्ण झालेले धडे',
      achievements: 'उपलब्ध्या',
      beginner: 'सुरुवातीचे',
      intermediate: 'मध्यम',
      advanced: 'प्रगत',
      startQuiz: 'क्विझ सुरू करा',
      nextQuestion: 'पुढील प्रश्न',
      correct: 'बरोबर!',
      incorrect: 'पुन्हा प्रयत्न करा',
      practice: 'सराव',
      level: 'पातळी',
      duration: 'कालावधी',
      lessons: 'धडे',
      continue: 'सुरू ठेवा',
      complete: 'पूर्ण',
      watchVideo: 'व्हिडिओ पहा',
      viewImages: 'प्रतिमा पहा',
      studentProgress: 'विद्यार्थी प्रगती',
      coursesCompleted: 'अभ्यासक्रम',
      totalQuizzesTaken: 'एकूण व्झ',
      studentDetails: 'विद्यार्थी प्रगती',
      performanceHistory: 'प्रदर्शिकाइतिहास',
      notes: 'शिक्षक गसाठी',
      addNote: 'टीप जोडा',
      saveNote: 'सेव जतन करा',
      cancel: 'रद्द करा',
      selectBuddy: 'चॅट करण्यासाठी मित्र निवडा',
      typeMessage: 'तुमचा संदेश टाइप करा...',
      send: 'पाठवा',
      online: 'ऑनलाइन',
      offline: 'ऑफलाइन',
      yourBuddies: 'तुमचे मित्र',
      findBuddy: 'नवीन मित्र',
      startConversation: 'संभाषण सुरू करा',
      typing: 'टाइप करत आहे...',
      quizComplete: 'क्विझ पूर्ण!',
      youScored: 'तुम्ही मिळवले',
      tryAgain: 'पुन्हा प्रयत्न करा',
      perfectScore: 'अत्यंत गुण!',
      keepLearning: 'शिकणे सुरू ठेवा!',
      loginAsStudent: 'लॉगिन',
      loginAsTeacher: 'शिक्षक महून लॉगिन',
      email: 'ईमेल',
      password: 'पासवर्ड',
      loginBtn: 'लॉगिन',
      welcomeStudent: 'स्वागत आहे, Student!',
      welcomeTeacher: 'स्वागत आहे, Teacher!',
      studentDashboard: 'विद्यार्थी प्रगती',
      yourProgress: 'तुमची प्रगती',
      coursesCompleted: 'अभ्यासक्रम पूर्ण झाले धडे',
      totalQuizzesTaken: 'एकूण व्झ',
      averageQuizScore: 'सरासरी क्विझ',
      recentQuizzes: 'अलीक डील क्रियाप',
      myBuddies: 'माझे मित्र',
      chatWithBuddy: 'मित्रांशी चॅट करा',
      viewAllStudents: 'सवे विद्यार्थी प्रगती',
      yourBuddies: 'तुमचे मित्र',
      viewAllStudents: 'सर्वे विद्यार्थी प्रगती',
      studentDetails: 'विद्यार्थी प्रगती',
      performanceHistory: 'प्रदर्शिकाइतिहास',
      notes: 'शिक्षक गसाठीली',
      addNote: 'टीप जोडा',
      saveNote: 'सेव जतन करा',
      cancel: 'रद्द करा'
    }
  };

  const t = content[language];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === allQuizQuestions[selectedQuizCategory][currentQuiz].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuiz < allQuizQuestions[selectedQuizCategory].length - 1) {
      setCurrentQuiz(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setQuizScore(0);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedBuddy) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      buddyId: selectedBuddy.id,
      senderName: 'You',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      message: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true,
      read: false,
      type: 'text'
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedBuddy.id]: [...(prev[selectedBuddy.id] || []), newMessage]
    }));
    setMessageInput('');

    setTimeout(() => {
      setTypingBuddies(prev => new Set(prev).add(selectedBuddy.id));
    }, 1000);

    setTimeout(() => {
      setTypingBuddies(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedBuddy.id);
        return newSet;
      });

      const responses = language === 'en' ? [
        'That\'s a great question! Let me help you with that.',
        'I understand. Here\'s what you need to know...',
        'Let\'s practice together! Watch how I do this sign.',
        'You\'re doing great! Keep practicing.'
      ] : [
        'चांगले प्रश्न! मी तुम्हाला मदत करतो.',
        'चांगले प्रश्न मी तुम्हाला मदत करतो.',
        'You\'re doing great! Keep practicing.'
      ];

      const responseMessage: ChatMessage = {
        id: Date.now() + 1,
        buddyId: selectedBuddy.id,
        senderName: selectedBuddy.name,
        senderAvatar: selectedBuddy.avatar,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isOwn: false,
        read: true,
        type: 'text'
      };

      setChatMessages(prev => ({
        ...prev,
        [selectedBuddy.id]: [...(prev[selectedBuddy.id] || []), responseMessage]
      }));
    }, 4000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogin = (email: string, password: string, role: 'student' | 'teacher') => {
    const user: User = {
      id: '1',
      name: role === 'student' ? 'Student User' : 'Teacher User',
      email,
      role,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      progress: role === 'student' ? 65 : 85,
      level: role === 'student' ? 'Intermediate' : 'Advanced',
      totalQuizScore: role === 'student' ? 78 : 92,
      lessonsCompleted: role === 'student' ? 25 : 38,
      lastActive: 'Now'
    };
    setCurrentUser(user);
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole('student');
    setActiveTab('home');
  };

  // Teacher functions to create content
  const handleCreateCourse = () => {
    if (newCourse.title && newCourse.description) {
      alert('Course created successfully!');
      setShowCreateCourse(false);
      setNewCourse({
        title: '',
        titleMr: '',
        description: '',
        descriptionMr: '',
        level: 'Beginner',
        duration: '2 weeks',
        youtubeVideo: '',
        image: ''
      });
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleCreateQuiz = () => {
    if (newQuiz.question && newQuiz.options[0]) {
      alert('Quiz created successfully!');
      setShowCreateQuiz(false);
      setNewQuiz({
        question: '',
        questionMr: '',
        options: ['', '', '', '', ''],
        optionsMr: ['', '', '', '', ''],
        correctAnswer: 0,
        category: 'basics',
        difficulty: 'easy',
        image: ''
      });
    } else {
      alert('Please fill in the question and at least one option');
    }
  };

  const currentQuizQuestions = allQuizQuestions[selectedQuizCategory];
  const totalQuestionsInCategory = Object.values(allQuizQuestions).flat().length;

  const scrollMessagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollMessagesEndRef.current) {
      scrollMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, selectedBuddy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header - Only show when logged in */}
      {isLoggedIn && (
        <header className="bg-white/95 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl">
                  <Hand className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent bg-clip-text">SignLearn</h1>
              </div>

              {/* Desktop Navigation - Simplified */}
              <nav className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'home'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  {t.home}
                </button>
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'courses'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  {t.courses}
                </button>
                {userRole === 'student' && (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === 'quiz'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Brain className="w-4 h-4" />
                    {t.quiz}
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('buddy-chat')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'buddy-chat'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  {t.buddyChat}
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'progress'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  {t.progress}
                </button>
                {userRole === 'teacher' && (
                  <button
                    onClick={() => setShowCreateCourse(!showCreateCourse)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    <Plus className="w-4 h-4" />
                    Create Course
                  </button>
                )}
                {userRole === 'teacher' && (
                  <button
                    onClick={() => setShowCreateQuiz(!showCreateQuiz)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4" />
                    Create Quiz
                  </button>
                )}
              </nav>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <Globe className="w-4 h-4" />
                  {language === 'en' ? 'मराठी' : 'English'}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  {t.logout}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Login Page - Shown when not logged in */}
            {!isLoggedIn && (
              <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <Hand className="w-16 h-16 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.welcome}</h2>
                    <p className="text-lg text-gray-600">{t.welcomeDesc}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">Login as:</h3>
                    <button
                      onClick={() => handleLogin('student@school.edu', 'password123', 'student')}
                      className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-5 h-5" />
                      {t.loginAsStudent}
                    </button>
                    <button
                      onClick={() => handleLogin('teacher@school.edu', 'password123', 'teacher')}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <GraduationCap className="w-5 h-5" />
                      {t.loginAsTeacher}
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-500 mb-4">New user? Create an account to get started</p>
                    <button
                      onClick={() => handleLogin('newuser@school.edu', 'password123', 'student')}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-md"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Home Page - Shown when logged in */}
            {isLoggedIn && activeTab === 'home' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Welcome Section */}
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block"
                  >
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-3xl shadow-2xl mb-6">
                      <Hand className="w-16 h-16 text-white" />
                    </div>
                  </motion.div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {language === 'en' ? `Welcome back, ${currentUser?.name || 'Student'}!` : `पुन्हा स्वागत आहे, ${currentUser?.name || 'विद्यार्थी'}!`}
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {language === 'en' 
                      ? 'Continue your sign language learning journey. You\'re doing great!' 
                      : 'तुमचे सांकेतिक भाषा शिक्षण सत्र चालू ठेवा. तुम्ही छान करत आहात!'}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-emerald-100 p-3 rounded-xl">
                        <BookOpen className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">8</p>
                        <p className="text-sm text-gray-600">{t.courses}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Brain className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">40</p>
                        <p className="text-sm text-gray-600">{t.quiz}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 p-3 rounded-xl">
                        <Trophy className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{currentUser?.progress || 0}%</p>
                        <p className="text-sm text-gray-600">{t.progress}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="bg-pink-100 p-3 rounded-xl">
                        <MessageSquare className="w-8 h-8 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">5</p>
                        <p className="text-sm text-gray-600">{t.buddyChat}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Learning */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.slice(0, 3).map((course) => (
                      <motion.div
                        key={course.id}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100"
                      >
                        <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`bg-gradient-to-r ${course.color} p-3 rounded-xl`}>
                              {course.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{language === 'en' ? course.title : course.titleMr}</h4>
                              <span className="text-sm text-gray-600">{course.level}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">
                            {language === 'en' ? course.description : course.descriptionMr}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
                            </div>
                            <button
                              onClick={() => setActiveTab('courses')}
                              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                            >
                              Continue →
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Courses Page */}
            {isLoggedIn && activeTab === 'courses' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.courses}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100"
                    >
                      <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`bg-gradient-to-r ${course.color} p-3 rounded-xl`}>
                            {course.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{language === 'en' ? course.title : course.titleMr}</h4>
                            <span className="text-sm text-gray-600">{course.level}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                          {language === 'en' ? course.description : course.descriptionMr}
                        </p>
                        <div className="space-y-3">
                          {course.youtubeVideo && (
                            <div className="aspect-video w-full rounded-xl overflow-hidden">
                              <iframe
                                src={course.youtubeVideo}
                                className="w-full h-full"
                                title={course.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                              <Star className="w-4 h-4 fill-current" />
                              {course.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Page - Different views for student and teacher */}
            {isLoggedIn && activeTab === 'quiz' && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">{t.quiz}</h2>
                  {userRole === 'teacher' && (
                    <button
                      onClick={() => setShowCreateQuiz(!showCreateQuiz)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Quiz
                    </button>
                  )}
                </div>

                {/* Teacher - Create Quiz Form */}
                {userRole === 'teacher' && showCreateQuiz && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Create New Quiz</h3>
                      <button
                        onClick={() => setShowCreateQuiz(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question (English)</label>
                        <input
                          type="text"
                          value={newQuiz.question}
                          onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
                          placeholder="Enter the question..."
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">प्रश्न (Marathi)</label>
                        <input
                          type="text"
                          value={newQuiz.questionMr}
                          onChange={(e) => setNewQuiz({ ...newQuiz, questionMr: e.target.value })}
                          placeholder="प्रश्न टाइपा..."
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select
                            value={newQuiz.category}
                            onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value as QuizCategory })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                          >
                            <option value="basics">Basics</option>
                            <option value="numbers">Numbers</option>
                            <option value="emotions">Emotions</option>
                            <option value="daily-life">Daily Life</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="marathi">Marathi</option>
                            <option value="practical">Practical</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                          <select
                            value={newQuiz.difficulty}
                            onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                        <div className="space-y-2">
                          {[0, 1, 2, 3].map((index) => (
                            <input
                              key={index}
                              type="text"
                              value={newQuiz.options[index]}
                              onChange={(e) => {
                                const newOptions = [...newQuiz.options];
                                newOptions[index] = e.target.value;
                                setNewQuiz({ ...newQuiz, options: newOptions });
                              }}
                              placeholder={`Option ${index + 1}`}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                        <select
                          value={newQuiz.correctAnswer}
                          onChange={(e) => setNewQuiz({ ...newQuiz, correctAnswer: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                        >
                          <option value={0}>Option 1</option>
                          <option value={1}>Option 2</option>
                          <option value={2}>Option 3</option>
                          <option value={3}>Option 4</option>
                        </select>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={handleCreateQuiz}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                        >
                          Create Quiz
                        </button>
                        <button
                          onClick={() => setShowCreateQuiz(false)}
                          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Student - Take Quiz OR Teacher - View Quizzes */}
                {!showCreateQuiz && (
                  <>
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                        <h3 className="text-xl font-semibold mb-4">
                          {userRole === 'student' ? 'Select Quiz Category' : 'Manage Quizzes'}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.keys(allQuizQuestions).map((category) => (
                            <button
                              key={category}
                              onClick={() => setSelectedQuizCategory(category as QuizCategory)}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                selectedQuizCategory === category
                                  ? 'border-emerald-500 bg-emerald-50'
                                  : 'border-gray-200 hover:border-emerald-300'
                              }`}
                            >
                              <p className="font-semibold capitalize text-gray-900">{category}</p>
                              <p className="text-sm text-gray-600">{allQuizQuestions[category as QuizCategory].length} questions</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Student can take quizzes */}
                    {userRole === 'student' && selectedQuizCategory && (
                      <>
                        <motion.div
                          key={currentQuiz}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100"
                        >
                          <div className="mb-6">
                            <span className="text-sm text-gray-600">
                              Question {currentQuiz + 1} of {allQuizQuestions[selectedQuizCategory].length}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-8">
                            {language === 'en'
                              ? allQuizQuestions[selectedQuizCategory][currentQuiz].question
                              : allQuizQuestions[selectedQuizCategory][currentQuiz].questionMr}
                          </h3>
                          <div className="space-y-4">
                            {allQuizQuestions[selectedQuizCategory][currentQuiz].options.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedAnswer(index)}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                                  selectedAnswer === index
                                    ? 'border-emerald-500 bg-emerald-50'
                                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                                }`}
                              >
                                <span className="font-medium text-gray-900">
                                  {language === 'en' ? option : allQuizQuestions[selectedQuizCategory][currentQuiz].optionsMr[index]}
                                </span>
                              </button>
                            ))}
                          </div>
                        </motion.div>

                        {/* Quiz Results Display */}
                        {selectedAnswer !== null && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${
                              selectedAnswer === allQuizQuestions[selectedQuizCategory][currentQuiz].correctAnswer
                                ? 'border-green-500'
                                : 'border-red-500'
                            }`}
                          >
                            <div className="text-center">
                              {selectedAnswer === allQuizQuestions[selectedQuizCategory][currentQuiz].correctAnswer ? (
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                              ) : (
                                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                              )}
                              <h3 className="text-2xl font-bold mb-4">
                                {selectedAnswer === allQuizQuestions[selectedQuizCategory][currentQuiz].correctAnswer
                                  ? 'Correct! 🎉'
                                  : 'Try Again'}
                              </h3>
                              <button
                                onClick={() => {
                                  if (selectedAnswer === allQuizQuestions[selectedQuizCategory][currentQuiz].correctAnswer) {
                                    setQuizScore(quizScore + 1);
                                  }
                                  setCurrentQuiz(currentQuiz + 1);
                                  setSelectedAnswer(null);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all"
                              >
                                Next Question →
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {currentQuiz >= allQuizQuestions[selectedQuizCategory].length && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-500 text-center"
                          >
                            <Trophy className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h3>
                            <p className="text-xl text-gray-600 mb-6">
                              You scored {quizScore} out of {allQuizQuestions[selectedQuizCategory].length}
                            </p>
                            <button
                              onClick={() => {
                                setCurrentQuiz(0);
                                setQuizScore(0);
                                setSelectedAnswer(null);
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all"
                            >
                              Try Again
                            </button>
                          </motion.div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Buddy Chat Page */}
            {isLoggedIn && activeTab === 'buddy-chat' && (
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.buddyChat}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Study Buddies</h3>
                    {buddies.map((buddy) => (
                      <motion.div
                        key={buddy.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedBuddy(buddy)}
                        className={`bg-white rounded-xl p-4 shadow-md border-2 cursor-pointer transition-all ${
                          selectedBuddy?.id === buddy.id ? 'border-emerald-500' : 'border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={buddy.avatar} alt={buddy.name} className="w-12 h-12 rounded-full" />
                            {buddy.online && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{buddy.name}</h4>
                            <p className="text-sm text-gray-600">{buddy.level} • {buddy.lastSeen}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col h-[600px]">
                    {selectedBuddy ? (
                      <>
                        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
                          <img src={selectedBuddy.avatar} alt={selectedBuddy.name} className="w-10 h-10 rounded-full" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{selectedBuddy.name}</h4>
                            <p className="text-sm text-emerald-600">{selectedBuddy.online ? 'Online' : 'Offline'}</p>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {(chatMessages[selectedBuddy.id] || []).map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs px-4 py-2 rounded-xl ${
                                message.isOwn
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                              <p>{message.message}</p>
                              <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                            </div>
                          </motion.div>
                          ))}
                          {typingBuddies.has(selectedBuddy.id) && (
                            <div className="flex justify-start">
                              <div className="bg-gray-100 px-4 py-2 rounded-xl">
                                <p className="text-gray-500">Typing...</p>
                              </div>
                            </div>
                          )}
                          <div ref={scrollMessagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-slate-200">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              placeholder="Type a message..."
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:outline-none"
                            />
                            <button
                              onClick={handleSendMessage}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                          <p>Select a study buddy to start chatting</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Progress Page */}
            {isLoggedIn && activeTab === 'progress' && (
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.progress}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <h3 className="text-xl font-semibold mb-4">Overall Progress</h3>
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="#e2e8f0"
                            strokeWidth="12"
                            fill="none"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * (currentUser?.progress || 0)) / 100}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#0d9488" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold text-gray-900">{currentUser?.progress || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                    <h3 className="text-xl font-semibold mb-4">Course Progress</h3>
                    <div className="space-y-4">
                      {courses.slice(0, 4).map((course) => (
                        <div key={course.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {language === 'en' ? course.title : course.titleMr}
                            </span>
                            <span className="text-sm text-gray-600">{course.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${course.color} rounded-full`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {userRole === 'teacher' && (
                  <div className="space-y-6">
                    {/* Teacher Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5" />
                          <span className="text-sm opacity-90">Total Students</span>
                        </div>
                        <p className="text-3xl font-bold">{students.length}</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-5 h-5" />
                          <span className="text-sm opacity-90">Avg Progress</span>
                        </div>
                        <p className="text-3xl font-bold">
                          {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-5 h-5" />
                          <span className="text-sm opacity-90">Avg Quiz Score</span>
                        </div>
                        <p className="text-3xl font-bold">
                          {Math.round(students.reduce((acc, s) => acc + s.totalQuizScore, 0) / students.length)}%
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-5 h-5" />
                          <span className="text-sm opacity-90">Lessons Completed</span>
                        </div>
                        <p className="text-3xl font-bold">
                          {students.reduce((acc, s) => acc + s.lessonsCompleted, 0)}
                        </p>
                      </div>
                    </div>

                    {/* Student Progress Table */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Student Progress Tracking</h3>
                        <span className="text-sm text-gray-600">{students.length} Students</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="text-left py-3 px-4">Student</th>
                              <th className="text-left py-3 px-4">Level</th>
                              <th className="text-left py-3 px-4">Progress</th>
                              <th className="text-left py-3 px-4">Quiz Score</th>
                              <th className="text-left py-3 px-4">Lessons</th>
                              <th className="text-left py-3 px-4">Last Active</th>
                              <th className="text-left py-3 px-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student) => (
                              <tr key={student.id} className="border-b border-slate-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full border-2 border-emerald-500" />
                                    <div>
                                      <span className="font-medium text-gray-900">{student.name}</span>
                                      <p className="text-xs text-gray-500">{student.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                    {student.level}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                                        style={{ width: `${student.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{student.progress}%</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    <span className="font-semibold text-gray-900">{student.totalQuizScore}%</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="text-gray-900 font-medium">{student.lessonsCompleted}</span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">{student.lastActive}</td>
                                <td className="py-3 px-4">
                                  <div className="flex gap-2">
                                    <button
                                      className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-all"
                                      title="Send Message"
                                    >
                                      <MessageSquare className="w-4 h-4" />
                                    </button>
                                    <button
                                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                                      title="View Details"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all"
                                      title="View Report"
                                    >
                                      <TrendingUp className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                        <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
                        <div className="space-y-3">
                          {students.slice(0, 3).map((student, index) => (
                            <div key={student.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                              }`}>
                                {index + 1}
                              </div>
                              <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-600">{student.totalQuizScore}% Quiz Score</p>
                              </div>
                              <Trophy className="w-5 h-5 text-yellow-500" />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                        <h3 className="text-lg font-semibold mb-4">Students Needing Help</h3>
                        <div className="space-y-3">
                          {students.filter(s => s.progress < 50).slice(0, 3).map((student) => (
                            <div key={student.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-sm text-red-600 font-medium">Progress: {student.progress}%</p>
                              </div>
                              <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all">
                                Help
                              </button>
                            </div>
                          ))}
                          {students.filter(s => s.progress < 50).length === 0 && (
                            <p className="text-center text-gray-500 py-4">All students are doing well! 🎉</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-xl">
                <Hand className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent bg-clip-text">SignLearn</h1>
              <span className="font-medium text-white">Learning for Everyone</span>
            </div>
            <p className="text-white/80">© 2024 SignLearn. Making education accessible.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
