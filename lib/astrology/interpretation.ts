import {
  AspectType,
  CalculatedAspect,
  CalculatedPlacement,
  CareerSynthesis,
  ElementBreakdown,
  EmotionalSynthesis,
  HolisticWellness,
  HouseData,
  ModalityBreakdown,
  PersonalitySynthesis,
  RelationshipSynthesis,
  ZodiacElement,
  ZodiacModality,
} from "./types";
import { HOUSE_DEFINITIONS, PLANET_DEFINITIONS, SIGN_MAP_BY_NAME } from "./constants";

// Helper: Format degree into "XX° YY'"
export function formatDegree(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const signDeg = normalized % 30;
  const d = Math.floor(signDeg);
  const m = Math.floor((signDeg - d) * 60);
  return `${d}° ${m < 10 ? "0" : ""}${m}'`;
}

// -------------------------------------------------------------
// PLANET PLACEMENT INTERPRETATION ENGINE
// -------------------------------------------------------------

export function generatePlacementInterpretation(
  planetKey: string,
  signName: string,
  houseNum: number,
  isRetrograde: boolean,
  aspectsCount: number
): {
  theme: string;
  insight: string;
  reflectionQuestion: string;
  strengths: string[];
  growthAreas: string[];
} {
  const planetDef = PLANET_DEFINITIONS[planetKey] || {
    name: planetKey,
    symbol: "✧",
    coreArchetype: "Astrolojik Enerji Odağı",
  };
  const sign = SIGN_MAP_BY_NAME[signName];
  const house = HOUSE_DEFINITIONS[houseNum] || HOUSE_DEFINITIONS[1];

  const element = sign?.element || "Ateş";
  const modality = sign?.modality || "Öncü";

  // Dynamic deterministic theme
  const theme = `${signName} Burcunda ve ${houseNum}. Evde ${planetDef.name}`;

  // Tailored multi-layered insight
  let insight = "";
  let reflectionQuestion = "";
  const strengths: string[] = [];
  const growthAreas: string[] = [];

  // Planet specific logic
  switch (planetKey) {
    case "sun":
      insight = `${signName} burcundaki Güneş, kimliğinizin merkezine ${sign?.keywords.slice(0, 3).join(", ").toLowerCase()} temalarını yerleştirir. ${house.title} (${house.theme}) alanında parlamak, yaşamdaki en temel varoluş amacınızdır. Bilinçli benliğiniz, ${element.toLowerCase()} elementiyle beslenir ve ${modality.toLowerCase()} nitelikle dünyayı deneyimler.${
        aspectsCount > 2
          ? " Güneş'inizin aldığı güçlü açı kombinasyonları, bireysel iradenizi yaşamınızın merkezinde dönüştürücü bir güce çevirir."
          : ""
      }`;
      reflectionQuestion = `Bugün aldığım kararlar, ${house.title}'in temsil ettiği ${house.theme.toLowerCase()} alanında gerçek benliğimi ve ${sign?.keywords[0]?.toLowerCase()} enerjimi ne kadar yansıtıyor?`;
      strengths.push(
        `${signName} doğasının getirdiği ${sign?.keywords[0] || "doğal liderlik"} gücü.`,
        `${house.title} odaklı konularda doğal bir motivasyon ve parlama yeteneği.`,
        `${element} elementinin sunduğu yaşamsal direnç ve karakter bütünlüğü.`
      );
      growthAreas.push(
        `Kişisel arzuları aşırı dayatmadan ${house.theme.toLowerCase()} alanında esnek kalabilmek.`,
        `Gölge yan olan ${sign?.keywords[2]?.toLowerCase()} eğilimini farkındalıkla yönetmek.`
      );
      break;

    case "moon":
      insight = `Ay'ın ${signName} burcundaki yerleşimi, duygusal güvenliğinizi ve içsel huzurunuzu ${sign?.keywords.slice(0, 3).join(", ").toLowerCase()} aracılığıyla kurduğunuzu gösterir. Bu enerji ${house.title} (${house.theme}) konularında daha sezgisel, korumacı ve duyarlı tepkiler vermenize zemin hazırlar. Bilinçdışı ihtiyaçlarınız doyurulduğunda, çevrenize yüksek bir duygusal denge yayarsınız.`;
      reflectionQuestion = `Duygusal olarak kendimi güvende hissetmediğimde, ${signName} burcunun koruma mekanizmalarına sığınıp ${house.title} meselelerinde aşırı tepki veriyor muyum?`;
      strengths.push(
        `Derin empati ve ${signName} enerjisiyle beslenen güçlü içsel sezgiler.`,
        `${house.title} ile bağlantılı insanlara güvenli ve şefkatli bir alan açabilme.`
      );
      growthAreas.push(
        `Ruh hali dalgalanmalarını kişisel almadan duygusal ihtiyaçları açıkça ifade etmek.`,
        `Geçmişe veya konfor alanına aşırı tutunma refleksini dengelemek.`
      );
      break;

    case "ascendant":
      insight = `Yükselen ${signName}, dünyaya ilk adımınızı atış tarzınızı, mizaç tonunuzu ve dışarıdan nasıl algılandığınızı belirler. 1. Evin başlangıcı olarak, insanlarla ilk temasınızda ${sign?.keywords.slice(0, 3).join(", ").toLowerCase()} nitelikleri ön plandadır. Bu filtre, yaşam deneyimlerinizi karşılama biçiminizin pusulasıdır.`;
      reflectionQuestion = `Dış dünyaya sunduğum ${signName} mizacı, iç dünyamdaki gerçek duygularımla ve niyetlerimle ne derece örtüşüyor?`;
      strengths.push(
        `Doğal ve etkileyici bir ilk izlenim bırakma kabiliyeti.`,
        `${signName} burcunun ${sign?.keywords[1] || "özgün"} yaklaşımıyla engelleri karşılama direnci.`
      );
      growthAreas.push(
        `Yalnızca ilk izlenim zırhına sığınmayıp içsel kırılganlığa da alan açabilmek.`
      );
      break;

    case "mercury":
      insight = `Merkür'ün ${signName} yerleşimi, düşünce yapınızın ve iletişim tarzınızın ${sign?.keywords.slice(0, 3).join(", ").toLowerCase()} ile şekillendiğini gösterir. Bilgiyi işleme ve paylaşma arzunuz en çok ${house.title} (${house.theme}) konularında aktiftir.${
        isRetrograde
          ? " Merkür retrograd olduğu için, düşünceleriniz dışa doğrudan yansımadan önce derin bir içsel tefekkür süzgecinden geçer."
          : ""
      }`;
      reflectionQuestion = `Fikirlerimi ifade ederken ${signName} üslubumun karşımdaki insanlarda nasıl yankı bulduğunu gerçekten dinliyor muyum?`;
      strengths.push(
        `${signName} tarzı düşünme hızı ve analitik/sezgisel bağlantı kurma ustalığı.`,
        `${house.title} konularında zihinsel netlik ve strateji geliştirme becerisi.`
      );
      growthAreas.push(
        `Zihinsel aşırı yüklenmelerde zihni sakinleştirecek ritüeller oluşturmak.`,
        `Detaylara veya sabit fikirlere takılmadan büyük resmi görebilmek.`
      );
      break;

    case "venus":
      insight = `Venüs ${signName} burcunda, sevgi alışverişinizi, estetik duyarlılığınızı ve neye değer verdiğinizi tanımlar. İlişkilerde ve bağ kurma biçiminizde ${sign?.keywords.slice(0, 3).join(", ").toLowerCase()} ön plandadır. Bu sevgi prensibi ${house.title} (${house.theme}) alanında çiçek açar; hem uyum hem de bolluk algınız bu yaşam temasıyla iç içedir.`;
      reflectionQuestion = `İlişkilerimde ve değer verdiğim konularda ${signName} burcunun beklentileriyle karşı tarafın sınırlarına saygıyı nasıl dengeliyorum?`;
      strengths.push(
        `İlişkilerde içten, estetik ve ${signName} burcuna özgü zarafet dolu bir sevgi dili.`,
        `${house.title} alanında bereket, sanat ve denge yaratma çekim gücü.`
      );
      growthAreas.push(
        `Sevgi almak için aşırı taviz vermekten veya kendi değerini dış onaya bağlamaktan kaçınmak.`
      );
      break;

    case "mars":
      insight = `Mars ${signName} burcunda, iradenizi ortaya koyma, hedeflere koşma ve sınır çizme biçiminizi yönetir. ${house.title} (${house.theme}) alanında harekete geçmek sizin için bir tutku ve cesaret meselesidir. Enerjinizi ${element.toLowerCase()} elementiyle odaklayıp ${modality.toLowerCase()} bir kararlılıkla eyleme dönüştürürsünüz.${
        isRetrograde ? " Mars retrograd olduğundan, enerjiniz dışa patlamaktansa içsel bir odaklanma ve disiplinle çalışır." : ""
      }`;
      reflectionQuestion = `Öfke, arzu ve motivasyonumu ${signName} doğasında yapıcı bir yaratıcılığa mı yoksa yıpratıcı bir mücadeleye mi yönlendiriyorum?`;
      strengths.push(
        `${house.title} konularında yılmayan mücadele ruhu ve kararlı aksiyon kabiliyeti.`,
        `Kişisel sınırları net ve dürüst biçimde koruyabilme cesareti.`
      );
      growthAreas.push(
        `Sabırsızlık ve fevrilik anlarında nefes alıp bilinçli duraklama pratiği kazanmak.`
      );
      break;

    case "jupiter":
      insight = `Jüpiter ${signName} burcunda, yaşamınızın en büyük genişleme, inanç ve bilgelik kapısını aralar. Şansınız ve vizyonunuz ${house.title} (${house.theme}) konularında cömertçe genişler. Evrene ve hayata güveniniz, ${sign?.keywords.slice(0, 2).join(" ve ").toLowerCase()} felsefesiyle birleştiğinde size yeni kapılar açar.`;
      reflectionQuestion = `Hayata duyduğum inancı ${house.title} alanında somut bir faydaya ve başkalarını yücelten bir bilgeliğe nasıl dönüştürebilirim?`;
      strengths.push(
        `Yüksek iyimserlik, vizyoner bakış açısı ve ${signName} bilgeliği.`,
        `${house.title} konularında genişleme fırsatlarını erkenden sezebilme.`
      );
      growthAreas.push(
        `Aşırı iyimserlikle gerçekçi sınırları gözden kaçırmamak; ölçülülüğü korumak.`
      );
      break;

    case "saturn":
      insight = `Satürn ${signName} burcunda, yaşam okulunuzun ana dersini, sabırla inşa edeceğiniz kalıcı ustalığı gösterir. ${house.title} (${house.theme}) alanında önce sınavlar, gecikmeler veya sorumluluklar hissedebilirsiniz; ancak bu alan, yıllar içinde en sağlam ve saygın mirasınızı inşa edeceğiniz yerdir.`;
      reflectionQuestion = `${house.title} konularında hissettiğim korku veya yetersizlik duygusunu, disiplinli bir ustalığa dönüştürmek için bugün hangi küçük adımı atabilirim?`;
      strengths.push(
        `Sarsılmaz sorumluluk bilinci, sabır ve ${signName} disiplini.`,
        `${house.title} alanında uzun vadeli, kalıcı ve saygın yapılar kurabilme gücü.`
      );
      growthAreas.push(
        `Aşırı katı özeleştiriden ve yetersizlik kaygısından sıyrılarak sürece güvenebilmek.`
      );
      break;

    case "uranus":
      insight = `Uranüs ${signName} burcunda, geleneksel kalıpları kıran, özgün ve yenilikçi uyanışları temsil eder. ${house.title} (${house.theme}) alanında sıra dışı fikirleriniz, aniden gelen aydınlanmalarınız ve bağımsızlık tutkunuz ön plandadır. Bu alan sizin sıradanlığa teslim olmadığınız yerdir.`;
      reflectionQuestion = `${house.title} alanındaki özgürlük ve yenilik arayışım, yapıcı bir ilhama mı yoksa nedensiz bir asiliğe mi hizmet ediyor?`;
      strengths.push(
        `Özgün vizyon, yenilikçi çözümler üretme ve tabuları yıkma cesareti.`,
        `${house.title} konularında çağı yakalayan modern yaklaşımlar geliştirme.`
      );
      growthAreas.push(
        `Ani tepkiler ve beklenmedik kopuşlar yerine yapıcı dönüşüm yollarını tercih etmek.`
      );
      break;

    case "neptune":
      insight = `Neptün ${signName} burcunda, ilahi ilhamı, yüksek hayal gücünü ve ruhsal empatiyi temsil eder. ${house.title} (${house.theme}) alanında maddi sınırların ötesine geçen bir sezgisellik ve idealizm taşırsınız. Bu alan sizin sanatsal ve spiritüel dinginlik vahamızdır.`;
      reflectionQuestion = `${house.title} alanında hayallerim ile somut gerçekler arasındaki dengeyi nasıl koruyabilirim?`;
      strengths.push(
        `Yüksek sezgisellik, sanatsal ilham ve koşulsuz şefkat yeteneği.`,
        `${house.title} konularına derin bir ruhsal anlam katabilme yetisi.`
      );
      growthAreas.push(
        `Gerçeklerden kaçış veya aşırı idealleştirme tuzağına düşmeden net sınırlar çizebilmek.`
      );
      break;

    case "pluto":
      insight = `Plüton ${signName} burcunda, küllerinden yeniden doğuşun, derin dönüşümün ve sarsılmaz iç gücün kaynağıdır. ${house.title} (${house.theme}) alanında yüzeysel hiçbir şeye yer yoktur; burada krizleri aşarak muazzam bir psikolojik dirayet ve kişisel otorite geliştirirsiniz.`;
      reflectionQuestion = `${house.title} alanında kontrolü bırakmaktan korktuğum şey nedir ve bu korkuyu nasıl bir içsel güce dönüştürebilirim?`;
      strengths.push(
        `Derin psikolojik kavrayış, krizlerden güçlenerek çıkma kabiliyeti.`,
        `${house.title} konularında köklü dönüşümler yaratabilme potansiyeli.`
      );
      growthAreas.push(
        `Güç savaşlarına veya aşırı şüpheciliğe kapılmadan güvenmeyi öğrenebilmek.`
      );
      break;

    case "chiron":
      insight = `Kiron ${signName} burcunda, en hassas yaralı yanınızın aynı zamanda en büyük şifa ve rehberlik kaynağınız olduğunu fısıldar. ${house.title} (${house.theme}) alanında deneyimlediğiniz hassasiyet, başkalarına empati kurma ve yol gösterme bilgeliğine evrilir.`;
      reflectionQuestion = `${house.title} konularında hissettiğim kırılganlık, bana ve başkalarına hangi şifalı dersi sunuyor?`;
      strengths.push(
        `Derin empati, başkalarının yaralarını anlama ve rehberlik edebilme gücü.`,
        `Kusurları kabul ederek özgün bir içsel bilgelik inşa etme.`
      );
      growthAreas.push(
        `Kendi ihtiyaçlarını ihmal ederek sürekli başkalarını kurtarma rolüne girmemek.`
      );
      break;

    case "true_node":
      insight = `Kuzey Ay Düğümü ${signName} burcunda ve ${house.title} (${house.theme}) alanında, bu yaşamda ruhunuzun yürümeye çağrıldığı gelişim rotasını gösterir. ${sign?.keywords.slice(0, 2).join(" ve ").toLowerCase()} niteliklerini kazanmak başlangıçta konfor alanınızın dışında hissettirse de, en büyük doyum ve tekamül bu yolda saklıdır.`;
      reflectionQuestion = `Geçmişin tanıdık alışkanlıklarını bırakıp ${signName} burcunun cesaret gerektiren yeni deneyimlerine adım atmaya hazır mıyım?`;
      strengths.push(
        `Gelişime açık bir ruhsal pusula ve yenilikçi öğrenme arzusu.`,
        `${house.title} alanında hayatın sunduğu kadersel büyüme fırsatlarını yakalama.`
      );
      growthAreas.push(
        `Eski konfor alanına dönme isteğine kapılmadan ileriye doğru adım atabilmek.`
      );
      break;

    case "south_node":
      insight = `Güney Ay Düğümü ${signName} burcunda ve ${house.title} (${house.theme}) alanında, geçmişten getirdiğiniz doğal yetenekleri ama aynı zamanda aşırıya kaçtığında sizi yerinizde saydıran tanıdık kalıpları temsil eder. Bu alanı bir temel olarak kullanmalı, ancak tek başına orada hapsolmamalısınız.`;
      reflectionQuestion = `${signName} burcunun hangi otomatik alışkanlıkları beni büyümeden alıkoyuyor?`;
      strengths.push(
        `Doğuştan gelen ustalık, tanıdık refleksler ve zengin bir tecrübe havuzu.`
      );
      growthAreas.push(
        `Konfor alanına yapışıp kalmadan Kuzey Düğümün gösterdiği yönle denge kurabilmek.`
      );
      break;

    default:
      insight = `${planetDef.name}, ${signName} burcunda ve ${house.title} alanında yaşam yolculuğunuza özgün bir titreşim kazandırır. Bu yerleşim, ${element.toLowerCase()} elementi nitelikleriyle haritanızda anlamlı bir köprü oluşturur.`;
      reflectionQuestion = `Bu yerleşimin enerjisini günlük hayatımda nasıl daha yapıcı kullanabilirim?`;
      strengths.push(`${signName} enerjisinin sağladığı doğal odaklanma gücü.`);
      growthAreas.push(`Enerjiyi dengeli ve bilinçli yönlendirmeyi sürdürmek.`);
  }

  return { theme, insight, reflectionQuestion, strengths, growthAreas };
}

// -------------------------------------------------------------
// HOUSE INTERPRETATION ENGINE
// -------------------------------------------------------------

export function generateHouseInterpretation(
  houseNum: number,
  signName: string,
  rulerPlanet: string,
  rulerHouseNum: number | undefined,
  planetsInside: string[]
): string {
  const house = HOUSE_DEFINITIONS[houseNum] || HOUSE_DEFINITIONS[1];
  const sign = SIGN_MAP_BY_NAME[signName];

  let text = `${house.number}. Ev (${house.title} — ${house.theme}), ${signName} burcunun giriş derecesiyle başlar. Bu yaşam alanında olayları ${sign?.keywords.slice(0, 3).join(", ").toLowerCase()} ile yönetirsiniz. `;

  if (rulerPlanet) {
    text += `Evin yöneticisi olan ${rulerPlanet}${
      rulerHouseNum
        ? `, ${rulerHouseNum}. Evde konumlanarak bu iki yaşam teması arasında doğrudan bir köprü kurar.`
        : " haritanızdaki konumuna göre bu evin enerjisini yönlendirir."
    } `;
  }

  if (planetsInside.length > 0) {
    text += `Bu evde yer alan ${planetsInside.join(", ")} gök cismi, ${house.theme.toLowerCase()} alanını yaşamınızın en dinamik ve dikkat çeken sahnelerinden biri haline getirir.`;
  } else {
    text += `Bu evde doğrudan bir gezegen bulunmaması bu alanın önemsiz olduğu anlamına gelmez; evin burcu olan ${signName} ve yöneticisi ${rulerPlanet}, bu alandaki deneyimlerinizin temel mimarıdır.`;
  }

  return text;
}

// -------------------------------------------------------------
// ASPECT INTERPRETATION ENGINE
// -------------------------------------------------------------

export function generateAspectInterpretation(
  bodyAKey: string,
  bodyBKey: string,
  aspectType: AspectType,
  orb: number
): { nature: "Harmonik" | "Dinamik" | "Birleştirici"; interpretation: string } {
  const pA = PLANET_DEFINITIONS[bodyAKey]?.name || bodyAKey;
  const pB = PLANET_DEFINITIONS[bodyBKey]?.name || bodyBKey;
  const orbFormatted = orb.toFixed(1);

  switch (aspectType) {
    case "conjunction":
      return {
        nature: "Birleştirici",
        interpretation: `${pA} ile ${pB} arasındaki kavuşum açısı (${orbFormatted}° orb), bu iki arketipin güçlerini tek bir odak noktasında birleştirir. İki gezegen birbiriyle iç içe çalışır; niyet ile eylem, duygu ile irade doğrudan kaynaşır.`,
      };
    case "trine":
      return {
        nature: "Harmonik",
        interpretation: `${pA} ile ${pB} arasındaki 120°'lik üçgen açı (${orbFormatted}° orb), bu iki gök cismi arasında doğal, zahmetsiz ve akıcı bir yetenek kanalı açar. Zorlanmadan akan bu uyum, kişisel yaşamınızda en büyük destek alanlarınızdan biridir.`,
      };
    case "sextile":
      return {
        nature: "Harmonik",
        interpretation: `${pA} ile ${pB} arasındaki 60°'lik sekstil açı (${orbFormatted}° orb), bilinçli farkındalık ve çabayla meyve veren fırsatlar yaratır. Bu iki arketip birbirini yapıcı biçimde destekler.`,
      };
    case "square":
      return {
        nature: "Dinamik",
        interpretation: `${pA} ile ${pB} arasındaki 90°'lik kare açı (${orbFormatted}° orb), içsel bir gerilim ve eylem baskısı üretir. Bu gerilim bir engel değil, sizi konfor alanından çıkarıp olgunlaştıran ve büyük başarılar getiren bir itici güçtür.`,
      };
    case "opposition":
      return {
        nature: "Dinamik",
        interpretation: `${pA} ile ${pB} arasındaki 180°'lik karşıt açı (${orbFormatted}° orb), iki kutup arasında bir denge ve ayna işlevi kurmanızı gerektirir. Karşıtlık, özellikle ilişkilerde yansıtma mekanizmasını fark ederek orta yolu bulma bilgeliği kazandırır.`,
      };
    default:
      return {
        nature: "Harmonik",
        interpretation: `${pA} ve ${pB} arasındaki açısal bağ (${orbFormatted}° orb), haritanızdaki bu iki potansiyel arasında anlamlı bir diyalog kurar.`,
      };
  }
}

// -------------------------------------------------------------
// MULTI-DIMENSIONAL SYNTHESIS ENGINE
// -------------------------------------------------------------

export function generateSynthesis(
  placements: CalculatedPlacement[],
  houses: HouseData[],
  aspects: CalculatedAspect[],
  angles: { asc?: { sign: string }; mc?: { sign: string } },
  elementBreakdown: Record<ZodiacElement, ElementBreakdown>,
  modalityBreakdown: Record<ZodiacModality, ModalityBreakdown>
): {
  personality: PersonalitySynthesis;
  relationships: RelationshipSynthesis;
  career: CareerSynthesis;
  emotional: EmotionalSynthesis;
  holistic: HolisticWellness;
} {
  const sun = placements.find((p) => p.id === "sun");
  const moon = placements.find((p) => p.id === "moon");
  const asc = placements.find((p) => p.id === "ascendant");
  const mercury = placements.find((p) => p.id === "mercury");
  const venus = placements.find((p) => p.id === "venus");
  const mars = placements.find((p) => p.id === "mars");
  const jupiter = placements.find((p) => p.id === "jupiter");
  const saturn = placements.find((p) => p.id === "saturn");

  const sunSign = sun?.sign || "Bilinmiyor";
  const moonSign = moon?.sign || "Bilinmiyor";
  const ascSign = asc?.sign || angles.asc?.sign || "Bilinmiyor";

  // Elements ranking
  const dominantElement = (Object.values(elementBreakdown) as ElementBreakdown[]).sort(
    (a, b) => b.percentage - a.percentage
  )[0];

  // 1. PERSONALITY SYNTHESIS
  const personalityHeadline = `${sunSign} Özü, ${moonSign} İç Dünyası ve ${ascSign} Yansımasıyla Özgün Kimlik`;
  const sunMoonRisingSynthesis = `Haritanızın sacayağı; ${sunSign} burcundaki Güneş'in getirdiği bilinçli amaç duygusu, ${moonSign} Ay'ının sunduğu içsel ihtiyaçlar ve ${ascSign} Yükselen'in dünyaya yansıttığı doğal duruşun ahengiyle örülmüştür. Güneşiniz ${sunSign} ilkeleriyle parlamayı hedeflerken, Ayınız ${moonSign} konforunda huzur bulur; Yükseleniniz ${ascSign} ise bu iki kutbu dış dünyayla zarif ve tutarlı bir diyalog içinde buluşturur.`;
  const mindAndCommunication = mercury
    ? `Düşünce mimarınız olan Merkür'ün ${mercury.sign} burcunda ve ${mercury.house} yerleşimi, zihninizin meseleleri ${
        SIGN_MAP_BY_NAME[mercury.sign]?.keywords.slice(0, 2).join(" ve ").toLowerCase() || "özgün"
      } bir bakış açısıyla süzdüğünü gösterir. Fikirlerinizi paylaşırken hem mantıksal kavrayışınız hem de algısal keskinliğiniz dikkat çeker.`
    : "Zihinsel süreçleriniz hayatın getirdiği farklı deneyimleri analiz etme ve sentezleme yeteneğinizle güçlenir.";

  const personalityStrengths = [
    `${sunSign} enerjisinden doğan belirgin irade ve kendini gerçekleştirme azmi.`,
    `${moonSign} Ay yerleşiminin kazandırdığı güçlü sezgisel farkındalık ve empati.`,
    `${dominantElement?.element || "Ateş"} elementinin haritadaki baskınlığıyla güçlenen doğal ${dominantElement?.nature.toLowerCase() || "canlılık"}.`,
  ];
  const personalityTensions = [
    `${sunSign} burcunun dışa dönük arzuları ile ${moonSign} burcunun içsel geri çekilme ihtiyaçlarını dengede tutabilmek.`,
    `Zihinsel yoğunluk anlarında esnek kalarak aşırı kontrolcü veya aceleci yaklaşımlardan sakınmak.`,
  ];

  // 2. RELATIONSHIPS SYNTHESIS
  const seventhHouse = houses.find((h) => h.number === 7);
  const fifthHouse = houses.find((h) => h.number === 5);
  const venusSign = venus?.sign || "Terazi";
  const marsSign = mars?.sign || "Koç";

  const relationshipHeadline = `Venüs ${venusSign} ve Mars ${marsSign}: Sevgi, Uyum ve Çekim Dinamikleri`;
  const loveStyle = `Sevgi dilinizi temsil eden Venüs'ün ${venusSign} burcunda (${venus?.house || "İlişki Evi"}) olması, partnerinizde öncelikle ${
    SIGN_MAP_BY_NAME[venusSign]?.keywords.slice(0, 3).join(", ").toLowerCase() || "samimiyet"
  } aradığınızı gösterir. İlişkilerde yapaylıktan uzak, karşılıklı değer ve derinlik içeren bağlar kurduğunuzda çiçek açarsınız.`;
  const venusMarsDynamic = `Arzu ve tutkunun gezegeni Mars ise ${marsSign} burcunda konumlanarak, sevgideki romantik zarafeti (${venusSign}) dinamik bir girişim ve koruyucu bir güçle (${marsSign}) dengeler. Bu ikili, çekim dünyanızda hem zihinsel/duygusal uyumu hem de sarsılmaz bir sadakati vazgeçilmez kılar.`;
  const partnershipHouses = `7. Evinizin başlangıcı (${seventhHouse?.sign || "Uyum"} burcu) ve 5. Eviniz (${fifthHouse?.sign || "Neşe"} burcu), uzun vadeli ortaklıklarda güven, saygı ve yaratıcı paylaşımların temel taş olduğunu vurgular.`;

  // 3. CAREER SYNTHESIS
  const tenthHouse = houses.find((h) => h.number === 10);
  const secondHouse = houses.find((h) => h.number === 2);
  const sixthHouse = houses.find((h) => h.number === 6);
  const mcSign = angles.mc?.sign || tenthHouse?.sign || "Oğlak";

  const careerHeadline = `Tepe Noktası (MC) ${mcSign}: Mesleki Ufuk, Başarı ve Kalıcı Miras`;
  const mcAndLifeDirection = `Toplumdaki yerinizi ve kariyer zirvenizi simgeleyen Tepe Noktası (MC) ${mcSign} burcunda yer alır. Bu gösterge, profesyonel yaşamda ${
    SIGN_MAP_BY_NAME[mcSign]?.keywords.slice(0, 3).join(", ").toLowerCase() || "kalıcılık ve vizyon"
  } ilkeleriyle tanınmak istediğinizi gösterir. Yalnızca bir iş yapmak değil, iz bırakan bir uzmanlık inşa etmek sizin için esastır.`;
  const workStyleAndHabits = `6. Evinizin (${sixthHouse?.sign || "Çalışma"} burcu) ve 2. Evinizin (${secondHouse?.sign || "Yetenek"} burcu) dinamikleri, günlük iş akışınızda özen, pratik fayda ve değer üretme arzusunun yüksek olduğunu işaret eder.`;
  const saturnJupiterBalance = `Disiplin mimarı Satürn (${saturn?.sign || "Oğlak"}) ile büyüme prensibi Jüpiter (${jupiter?.sign || "Yay"}), mesleki adımlarınızda sağlam bir temkinlilik ile cesur bir vizyonu harmanlama potansiyeli sunar.`;

  // 4. EMOTIONAL SYNTHESIS
  const fourthHouse = houses.find((h) => h.number === 4);
  const emotionalHeadline = `Ay ${moonSign} ve 4. Ev: İçsel Güvenlik ve Ruhsal Yuva`;
  const moonNeeds = `Bilinçdışı duygusal motorunuz olan Ay'ın ${moonSign} burcundaki yerleşimi, en çok ${
    SIGN_MAP_BY_NAME[moonSign]?.keywords.slice(0, 3).join(", ").toLowerCase() || "huzur"
  } ortamında şarj olduğunuzu anlatır. Duygularınızı bastırmak yerine onları kabul edip şefkatle kucakladığınızda iç huzurunuz pekişir.`;
  const safeHavenFourthHouse = `4. Evinizin ${fourthHouse?.sign || "Kökler"} burcundaki yerleşimi, yuvanızın ve özel yaşam alanınızın dış dünyanın karmaşasından sığındığınız kutsal bir barınak olduğunu vurgular.`;

  // 5. HOLISTIC WELLNESS (Strictly non-medical, symbolic well-being)
  const holisticHeadline = "Kozmik Denge ve Yaşam Ritmi Farkındalığı";
  const vitalityTheme = `Güneş (${sunSign}) ve Yükselen (${ascSign}) birleşimi, yaşam enerjinizin ${dominantElement?.element || "Ateş"} elementinin sunduğu ritimle dengelenmesini önerir. Bu arketipsel yaklaşım, beden ve zihin arasındaki doğal uyumu gözetmenizi hatırlatır.`;
  const elementalBalanceNote = `Haritanızda ${dominantElement?.element} elementi %${dominantElement?.percentage || 25} oranıyla belirgindir. Zihinsel veya duygusal yorgunluk hissettiğinizde, doğayla temas, dingin nefes pratikleri ve düzenli uyku gibi sade ritimler bütünsel dengenizi destekler.`;

  return {
    personality: {
      headline: personalityHeadline,
      summary: `${sunSign} iradesi, ${moonSign} sezgisi ve ${ascSign} mizacının dengeli bir portresi.`,
      sunMoonRisingSynthesis,
      mindAndCommunication,
      coreStrengths: personalityStrengths,
      innerTensionsAndGrowth: personalityTensions,
    },
    relationships: {
      headline: relationshipHeadline,
      loveStyle,
      venusMarsDynamic,
      partnershipHouses,
      attractionAndExpectations: `İlişkilerde yüzeysel çekimlerin ötesinde ruhsal derinlik, dürüstlük ve ${venusSign} burcuna yakışan bir değer duygusu ararsınız.`,
      constructiveAdvice: `Beklentilerinizi zihinde tutmak yerine şeffaf ve açık yüreklilikle partnerinizle paylaşmak bağlarınızı güçlendirir.`,
    },
    career: {
      headline: careerHeadline,
      mcAndLifeDirection,
      workStyleAndHabits,
      materialValuesAndTalents: `Maddi ve manevi değer üretiminiz, yeteneklerinizi pratik dünyada başkalarının faydasına sunabildiğiniz ölçüde bereketlenir.`,
      saturnJupiterBalance,
      inspirationalFields: `${mcSign} arketipi; organizasyon, danışmanlık, yaratıcı tasarım, strateji, eğitim veya rehberlik gibi alanlarda kalıcı bir etki yaratabileceğinizi sembolize eder.`,
    },
    emotional: {
      headline: emotionalHeadline,
      moonNeeds,
      safeHavenFourthHouse,
      emotionalReactions: `Baskı altında hissettiğinizde ${moonSign} refleksleriyle geri çekilip kendinizi dinleme ihtiyacınız doğaldır; bu ihtiyaca saygı gösterin.`,
      selfCareSuggestion: `Günün sonunda sessiz kalabileceğiniz, müzik dinleyebileceğiniz veya günlük tutabileceğiniz 15 dakikalık bir alan açmak duygusal berraklığınızı korur.`,
    },
    holistic: {
      headline: holisticHeadline,
      vitalityTheme,
      elementalBalanceNote,
      mindBodyRhythm: `Astrolojik sembolizmde 6. ev ve Ay ritimleri, bedeninizin verdiği ince sinyalleri dinlemenin önemini vurgular. Kendinize şefkatle yaklaşmak en kıymetli şifadır.`,
      lifestyleAffirmation: "Kendi doğal ritmime saygı duyuyor, dengemi ve canlılığımı bilinçle koruyorum.",
    },
  };
}
