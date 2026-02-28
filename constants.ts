import { Theme, Sponsor, FAQItem, GameProject } from './types';

// DATA STRUCTURES UPDATED FOR I18N

export const HUJAM_THEMES = {
  tr: [
    { year: "2025", title: "Devrim", concept: "Mevcut düzenin yıkılışı ve yeninin inşası üzerine kurulu radikal değişim mekanikleri.", color: "text-cyber-red border-cyber-red shadow-cyber-red" },
    { year: "2024", title: "Fütürizm", concept: "Geleceğin teknolojisi, neon şehirler ve insan-makine etkileşimi.", color: "text-cyan-400 border-cyan-400 shadow-cyan-400" },
    { year: "2023", title: "Uzay", concept: "Bilinmeyene yolculuk, yerçekimsiz ortamlar ve kozmik keşif.", color: "text-purple-400 border-purple-400 shadow-purple-400" },
    { year: "2022", title: "Evrim", concept: "Basit organizmalardan karmaşık sistemlere geçiş ve adaptasyon süreci.", color: "text-green-400 border-green-400 shadow-green-400" },
  ],
  en: [
    { year: "2025", title: "Revolution", concept: "Radical change mechanics built on the destruction of the current order and the construction of the new.", color: "text-cyber-red border-cyber-red shadow-cyber-red" },
    { year: "2024", title: "Futurism", concept: "Technology of the future, neon cities, and human-machine interaction.", color: "text-cyan-400 border-cyan-400 shadow-cyan-400" },
    { year: "2023", title: "Space", concept: "Journey to the unknown, zero-gravity environments, and cosmic exploration.", color: "text-purple-400 border-purple-400 shadow-purple-400" },
    { year: "2022", title: "Evolution", concept: "Transition from simple organisms to complex systems and the adaptation process.", color: "text-green-400 border-green-400 shadow-green-400" },
  ]
};

export const SPONSORS: Sponsor[] = [
  { name: "TaleWorlds Entertainment", tier: "main" },
  { name: "Kelimelik", tier: "platinum" },
  { name: "Netinternet", tier: "server" },
  { name: "İlkbyte", tier: "server" },
  { name: "Altınyıldız Classics", tier: "clothing" },
  { name: "TTCoin Network", tier: "gold" },
  { name: "MagicLab", tier: "gold" },
  { name: "SwishSwoosh", tier: "audio" },
  { name: "Mad Rooster", tier: "audio" },
  { name: "Miuul", tier: "education" },
];

export const PORTFOLIO_PROJECTS = {
  tr: [
    {
      id: "1",
      teamName: "Pixel Pioneers",
      gameTitle: "Neon Revolution",
      image: "https://picsum.photos/800/600?random=1",
      screenshots: ["https://picsum.photos/800/450?random=101", "https://picsum.photos/800/450?random=102", "https://picsum.photos/800/450?random=103"],
      engine: "Unity 6",
      members: ["Ali Yılmaz (Dev)", "Ayşe Kaya (Art)", "Mehmet Demir (Sound)"],
      itchUrl: "#",
      downloadUrl: "#",
      description: "Neon Revolution, cyberpunk bir distopyada geçen hızlı tempolu bir platform oyunudur. Oyuncular, şehri kontrol eden yapay zekaya karşı direnişi yönetirler. Yerçekimi manipülasyonu ve hızlı dash mekanikleri içerir.",
      assets: "Tüm görseller ekip tarafından çizildi. Müzikler CC0."
    },
    {
      id: "2",
      teamName: "Code Breakers",
      gameTitle: "Cyber Escape",
      image: "https://picsum.photos/800/600?random=2",
      screenshots: ["https://picsum.photos/800/450?random=201", "https://picsum.photos/800/450?random=202"],
      engine: "Unreal Engine 5",
      members: ["Can Yıldız (Dev)", "Deniz Aksoy (Level Design)"],
      itchUrl: "#",
      description: "Bir hacker simülasyonu. Terminal komutlarını kullanarak güvenlik sistemlerini aşmaya çalıştığınız bulmaca tabanlı bir oyun.",
      assets: "Kenney Assets kullanıldı."
    },
    {
      id: "3",
      teamName: "Null Pointers",
      gameTitle: "Space Drifter",
      image: "https://picsum.photos/800/600?random=3",
      screenshots: ["https://picsum.photos/800/450?random=301", "https://picsum.photos/800/450?random=302", "https://picsum.photos/800/450?random=303"],
      engine: "Godot 4.2",
      members: ["Elif (Art)", "Burak (Dev)", "Selin (Dev)"],
      itchUrl: "#",
      downloadUrl: "#",
      description: "Sıfır yerçekiminde geçen bir yarış oyunu. Fizik tabanlı sürüş mekanikleri ve prosedürel oluşturulan parkurlar.",
      assets: "Kendi üretimimiz."
    },
    {
      id: "4",
      teamName: "Glitch Mob",
      gameTitle: "Evolution Zero",
      image: "https://picsum.photos/800/600?random=4",
      screenshots: ["https://picsum.photos/800/450?random=401"],
      engine: "GameMaker Studio 2",
      members: ["Mert (All-rounder)", "Zeynep (Pixel Art)"],
      itchUrl: "#",
      description: "Tek hücreli bir canlıdan başlayarak galaksiyi ele geçiren bir türe evrilme simülasyonu.",
      assets: "Müzikler: Kevin MacLeod"
    },
    {
      id: "5",
      teamName: "Binary Bards",
      gameTitle: "Echoes of Silicon",
      image: "https://picsum.photos/800/600?random=5",
      screenshots: ["https://picsum.photos/800/450?random=501"],
      engine: "Unity 6",
      members: ["Can (Dev)", "Ece (Art)"],
      itchUrl: "#",
      description: "Terk edilmiş bir sunucu çiftliğinde geçen atmosferik bir keşif oyunu. Işık ve gölge mekanikleri üzerine kurulu bulmacalar.",
      assets: "Synty Studios"
    },
    {
      id: "6",
      teamName: "Neural Networks",
      gameTitle: "Data Stream",
      image: "https://picsum.photos/800/600?random=6",
      screenshots: ["https://picsum.photos/800/450?random=601"],
      engine: "Godot 4",
      members: ["Umut (Dev)", "Selin (Music)"],
      itchUrl: "#",
      description: "Veri paketlerini hedeflerine ulaştırmaya çalıştığınız bir tower defense oyunu. Rogue-like elementler içerir.",
      assets: "Kenney"
    }
  ],
  en: [
    {
      id: "1",
      teamName: "Pixel Pioneers",
      gameTitle: "Neon Revolution",
      image: "https://picsum.photos/800/600?random=1",
      screenshots: ["https://picsum.photos/800/450?random=101", "https://picsum.photos/800/450?random=102", "https://picsum.photos/800/450?random=103"],
      engine: "Unity 6",
      members: ["Ali Yılmaz (Dev)", "Ayşe Kaya (Art)", "Mehmet Demir (Sound)"],
      itchUrl: "#",
      downloadUrl: "#",
      description: "Neon Revolution is a fast-paced platformer set in a cyberpunk dystopia. Players lead the resistance against the AI controlling the city. Features gravity manipulation and quick dash mechanics.",
      assets: "All visuals drawn by the team. Music CC0."
    },
    {
      id: "2",
      teamName: "Code Breakers",
      gameTitle: "Cyber Escape",
      image: "https://picsum.photos/800/600?random=2",
      screenshots: ["https://picsum.photos/800/450?random=201", "https://picsum.photos/800/450?random=202"],
      engine: "Unreal Engine 5",
      members: ["Can Yıldız (Dev)", "Deniz Aksoy (Level Design)"],
      itchUrl: "#",
      description: "A hacker simulation. A puzzle-based game where you try to bypass security systems using terminal commands.",
      assets: "Used Kenney Assets."
    },
    {
      id: "3",
      teamName: "Null Pointers",
      gameTitle: "Space Drifter",
      image: "https://picsum.photos/800/600?random=3",
      screenshots: ["https://picsum.photos/800/450?random=301", "https://picsum.photos/800/450?random=302", "https://picsum.photos/800/450?random=303"],
      engine: "Godot 4.2",
      members: ["Elif (Art)", "Burak (Dev)", "Selin (Dev)"],
      itchUrl: "#",
      downloadUrl: "#",
      description: "A racing game set in zero gravity. Physics-based driving mechanics and procedurally generated tracks.",
      assets: "Self-made."
    },
    {
      id: "4",
      teamName: "Glitch Mob",
      gameTitle: "Evolution Zero",
      image: "https://picsum.photos/800/600?random=4",
      screenshots: ["https://picsum.photos/800/450?random=401"],
      engine: "GameMaker Studio 2",
      members: ["Mert (All-rounder)", "Zeynep (Pixel Art)"],
      itchUrl: "#",
      description: "A simulation of evolving from a single-celled organism to a species that conquers the galaxy.",
      assets: "Music: Kevin MacLeod"
    },
    {
      id: "5",
      teamName: "Binary Bards",
      gameTitle: "Echoes of Silicon",
      image: "https://picsum.photos/800/600?random=5",
      screenshots: ["https://picsum.photos/800/450?random=501"],
      engine: "Unity 6",
      members: ["Can (Dev)", "Ece (Art)"],
      itchUrl: "#",
      description: "An atmospheric exploration game set in an abandoned server farm. Puzzles based on light and shadow mechanics.",
      assets: "Synty Studios"
    },
    {
      id: "6",
      teamName: "Neural Networks",
      gameTitle: "Data Stream",
      image: "https://picsum.photos/800/600?random=6",
      screenshots: ["https://picsum.photos/800/450?random=601"],
      engine: "Godot 4",
      members: ["Umut (Dev)", "Selin (Music)"],
      itchUrl: "#",
      description: "A tower defense game where you try to deliver data packets to their destinations. Contains rogue-like elements.",
      assets: "Kenney"
    }
  ]
};

export const FAQS = {
  tr: [
    {
      question: "Takımımı nasıl oluşturabilirim?",
      answer: "Kayıt formunda takım adı belirterek bireysel veya grup olarak başvurabilirsin. Takım arayışı sırasında websitemizdeki takım lobisini veya sosyal platformları kullanabilirsin."
    },
    {
      question: "Finale kimler katılabiliyor?",
      answer: "Takımlar Tunçalp Özgen Kongre ve Kültür Merkezi’ne davet edilir. Her takımdan en az bir kişi fiziksel olarak alanda bulunmalıdır."
    },
    {
      question: "Hangi oyun motorlarını kullanabilirim?",
      answer: "Unity, Unreal Engine, Godot, Construct, GameMaker Studio veya benzeri motorlar kullanılabilir."
    },
    {
      question: "Hazır asset kullanabilir miyim?",
      answer: "Açık lisanslı, kendi ürettiğin veya yasal olarak satın aldığın materyaller kullanılabilir. Lisans türü oyun açıklamasında belirtilmelidir."
    },
    {
      question: "Oyunumu nasıl teslim edeceğim?",
      answer: "Oyun teslimleri HUJAM 2025’in resmi itch.io sayfası üzerinden yapılır. Ek belgeler gerekmez."
    },
    {
      question: "Jüri değerlendirmesi nasıl olacak?",
      answer: "Tema uyumu, yaratıcılık, oynanabilirlik ve teknik yeterlilik değerlendirilir."
    },
    {
      question: "Sunum yapmak zorunlu mu?",
      answer: "Zorunlu değildir; sunum yapan takımlar projelerini jüriye tanıtma fırsatı elde eder."
    },
    {
      question: "Ödüller neler olacak?",
      answer: "En iyi üç oyun ödüllendirilecektir. Ek olarak özel kategoriler duyurulabilir."
    },
    {
      question: "İnternet sağlanacak mı?",
      answer: "Etkinlik boyunca internet Eduroam üzerinden sağlanacaktır. Eduroam ağı Hacettepe Üniversitesi Bilgi İşlem Daire Başkanlığı tarafından yönetilip sağlanmaktadır. Eduroam hesabınız ve bağlantıyla ilgili problemleriniz varsa tercihen yarışma öncesi üniversitenizin bilgi işlem daire başkanlığından destek alınız."
    },
    {
      question: "Elektrik ve priz desteği sağlanacak mı?",
      answer: "Evet, etkinlik alanında katılımcıların kullanımı için gerekli çoklu priz ve uzatma kablosu altyapısı organizasyon tarafından sağlanacaktır."
    }
  ],
  en: [
    {
      question: "How can I form my team?",
      answer: "You can apply individually or as a group by specifying a team name in the registration form. During the team search, you can use the team lobby on our website or social platforms."
    },
    {
      question: "Who can participate in the finals?",
      answer: "Teams are invited to the Tunçalp Özgen Congress and Culture Center. At least one person from each team must be physically present at the venue."
    },
    {
      question: "Which game engines can I use?",
      answer: "Unity, Unreal Engine, Godot, Construct, GameMaker Studio, or similar engines can be used."
    },
    {
      question: "Can I use ready-made assets?",
      answer: "Open-licensed materials, materials you created yourself, or legally purchased materials can be used. The license type must be stated in the game description."
    },
    {
      question: "How will I submit my game?",
      answer: "Game submissions are made via the official HUJAM 2025 itch.io page. Additional documents are not required."
    },
    {
      question: "How will the jury evaluation be?",
      answer: "Theme compliance, creativity, playability, and technical proficiency are evaluated."
    },
    {
      question: "Is it mandatory to make a presentation?",
      answer: "It is not mandatory; teams that make a presentation get the opportunity to introduce their projects to the jury."
    },
    {
      question: "What will the awards be?",
      answer: "The top three games will be awarded. Additionally, special categories may be announced."
    },
    {
      question: "Will internet be provided?",
      answer: "Internet will be provided via Eduroam throughout the event. The Eduroam network is managed and provided by the Hacettepe University IT Department. If you have problems with your Eduroam account and connection, preferably get support from your university's IT department before the competition."
    },
    {
      question: "Will electricity and socket support be provided?",
      answer: "Yes, the necessary multi-socket and extension cord infrastructure for the use of participants in the event area will be provided by the organization."
    }
  ]
};