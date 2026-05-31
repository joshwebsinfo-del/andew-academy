export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizModule {
  id: string;
  title: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  badge: string;
  badgeLevel: string;
  questions: QuizQuestion[];
}

export const QUIZ_MODULES: QuizModule[] = [
  {
    id: "lo1-raw-materials",
    title: "LO1: Process & Classify Raw Materials",
    subject: "Raw Materials",
    difficulty: "Intermediate",
    badge: "Raw Classifier Peer",
    badgeLevel: "LO1 Verified",
    questions: [
      {
        id: "lo1-1",
        question: "Which class of metallurgical ores consists primarily of compounds where metals are chemically bonded to sulfur, and typically requires roasting in air?",
        options: [
          "Oxide ores (e.g., Hematite)",
          "Sulfide ores (e.g., Chalcopyrite)",
          "Silicate ores (e.g., Beryl)",
          "Carbonate ores (e.g., Malachite)"
        ],
        correctIndex: 1,
        explanation: "Sulfide ores (such as chalcopyrite CuFeS2 or galena PbS) contain metals bonded to sulfur. They generally require roasting in high-temperature air streams to convert them into oxides and extractable sulfur dioxide gas before smelting."
      },
      {
        id: "lo1-2",
        question: "In metallurgical screen grading, if a 500g dry ore sample is passed through a sieve and 125g is retained on the screen, what is the weight percentage of the oversize material?",
        options: ["12.5%", "25.0%", "50.0%", "75.0%"],
        correctIndex: 1,
        explanation: "Weight percentage of oversize (retained on screen) material is calculated as: (Retained Mass / Total Mass) * 100% = (125g / 500g) * 100% = 25.0%."
      },
      {
        id: "lo1-3",
        question: "Which of the following base or precious metal ions belongs to the Platinum Group Metals (PGM) class of metallurgical ores?",
        options: [
          "Neodymium (Nd)",
          "Ruthenium (Ru)",
          "Lanthanum (La)",
          "Yttrium (Y)"
        ],
        correctIndex: 1,
        explanation: "The Platinum Group Metals (PGMs) group in industrial metallurgy contains Platinum (Pt), Palladium (Pd), Rhodium (Rh), Ruthenium (Ru), Iridium (Ir), and Osmium (Os). Neodymium and Lanthanum are Rare Earth Elements (REEs)."
      },
      {
        id: "lo1-4",
        question: "When performing gravimetric moisture determination, a crushed gold-bearing ore sample has a wet weight of 200g. After drying in a laboratory furnace at 105°C, the static dry weight is 192g. What was the moisture percentage?",
        options: ["1.0%", "2.0%", "4.0%", "8.0%"],
        correctIndex: 2,
        explanation: "Moisture content percentage is calculated as: (Wet mass - Dry mass) / Wet mass * 100% = (200 - 192) / 200 * 100% = 8 / 200 * 100% = 4.0% moisture."
      },
      {
        id: "lo1-5",
        question: "Which historical atomic model first introduced the concept of quantized electron orbits revolving around a positively charged nucleus, heavily aiding modern chemical bonding and metallurgical crystal studies?",
        options: [
          "Dalton's Solid Sphere Model",
          "Thomson's Plum Pudding Model",
          "Bohr's Shell Energy Model",
          "Rutherford's Alpha Nuclear Model"
        ],
        correctIndex: 2,
        explanation: "Niels Bohr's model introduced quantized electron shells, explaining that electrons travel in defined circular orbits. This explains valence shells, periodicity, and reactivity trends when base metals combine."
      },
      {
        id: "lo1-6",
        question: "What form of iron ore has the chemical formula Fe3O4 and exhibits strong natural magnetic properties?",
        options: [
          "Hematite",
          "Magnetite",
          "Siderite",
          "Goethite"
        ],
        correctIndex: 1,
        explanation: "Magnetite (Fe3O4) is a ferrimagnetic iron oxide mineral with a very high iron content (~72.4%). Its strong response to magnetic force makes magnetic drum separators highly effective for enrichment."
      },
      {
        id: "lo1-7",
        question: "What is the main gangue component present in raw acid silicates that is highly undesirable in high quantities in blast furnaces?",
        options: [
          "Silica (SiO2)",
          "Calcium Oxide (CaO)",
          "Magnesium Oxide (MgO)",
          "Carbon (C)"
        ],
        correctIndex: 0,
        explanation: "Silica (SiO2) is the primary acidic gangue impurifying metal ores. Leaving silica in the metal compromises structural integrity, necessitating fluxing with basis limestone to form slag."
      },
      {
        id: "lo1-8",
        question: "When classifying run-of-mine ores, if of 400g material, 160g passes through the finest screen (undersize), what is the undersize weight fraction?",
        options: ["10.0%", "20.0%", "40.0%", "60.0%"],
        correctIndex: 2,
        explanation: "Undersize weight percentage is calculated as: (Undersize Mass / Total Mass) * 100% = (160g / 400g) * 100% = 40.0%."
      },
      {
        id: "lo1-9",
        question: "Why are nickel sulfide ores subjected to differential froth flotation during mineral processing?",
        options: [
          "To increase the copper content instead",
          "To separate valuable pentlandite minerals from barren pyrrhotite gangue",
          "To decrease the roasting temperature",
          "To dissolve the iron matrix in acid"
        ],
        correctIndex: 1,
        explanation: "Pentlandite ((Fe,Ni)9S8) is the chief nickel mineral. Differential flotation uses specific collectors and depressants to selectively float pentlandite while keeping worthless pyrrhotite (Fe1-xS) down."
      },
      {
        id: "lo1-10",
        question: "If an ore sample exhibits a wet mass of 1200g and a dry mass of 1140g, what is its percentage moisture content?",
        options: ["2.5%", "5.0%", "10.0%", "12.0%"],
        correctIndex: 1,
        explanation: "Moisture content ratio = (Wet mass - Dry mass) / Wet mass * 100% = (1200 - 1140) / 1200 * 100% = 60 / 1200 * 100% = 5.0%."
      },
      {
        id: "lo1-11",
        question: "Chromite ore is primarily classified as which kind of mineral structure?",
        options: [
          "Carbonate structure",
          "Sulfide structure",
          "Spinel oxide structure",
          "Hydrous silicate structure"
        ],
        correctIndex: 2,
        explanation: "Chromite (FeCr2O4) crystallizes in the cubic spinel structure and is the principal commercial source of chromium, essential for stainless steel alloys."
      },
      {
        id: "lo1-12",
        question: "Which PGM element is highly valued for catalytic applications and has the highest melting point among the PGMs?",
        options: [
          "Iridium (Ir)",
          "Osmium (Os)",
          "Ruthenium (Ru)",
          "Platinum (Pt)"
        ],
        correctIndex: 1,
        explanation: "Osmium has the highest melting point (3033°C) and density of all Platinum Group Metals (PGMs), making it extremely stable though challenging to process."
      },
      {
        id: "lo1-13",
        question: "If a screening system has a feed rate of 100 tonnes per hour and the oversize discharge rate is 45 tonnes per hour, what is the weight fraction of undersize material?",
        options: ["45.0%", "55.0%", "90.0%", "10.0%"],
        correctIndex: 1,
        explanation: "Undersize weight fraction = 100 tonnes - 45 tonnes of oversize = 55 tonnes per hour. As a percentage of the total feed, this represents exactly 55.0%."
      },
      {
        id: "lo1-14",
        question: "Which base metal is predominantly extracted from the mineral Galena (PbS)?",
        options: ["Zinc", "Lead", "Cadmium", "Cobalt"],
        correctIndex: 1,
        explanation: "Galena (PbS) is the most abundant and widely used mineral source in lead smelting. It crystallizes in a distinctive cubic system."
      },
      {
        id: "lo1-15",
        question: "What type of bond is formed when valence electrons are completely transferred from a metal to a non-metal, forming a rigid crystal lattice?",
        options: [
          "Covalent bonding",
          "Ionic bonding",
          "Metallic bonding",
          "Van der Waals attraction"
        ],
        correctIndex: 1,
        explanation: "Ionic bonds form through complete electron transfer, creating electrostatic attractions ideal for high-melting flux agents like calcium fluoride."
      },
      {
        id: "lo1-16",
        question: "What is the main advantage of Hematite (Fe2O3) ores compared to Magnetite (Fe3O4) ores in terms of required pre-treatment oxidation?",
        options: [
          "It does not require magnetic separation at all",
          "It is already fully oxidized and ready for direct reduction reactions",
          "It liquefies at room temperature",
          "It contains absolutely no silicate impurities"
        ],
        correctIndex: 1,
        explanation: "Hematite is already fully oxidized (Fe3+) and can be fed directly after sizing, whereas some magnetic ores need complex separation and pre-heating/pre-oxidation treatments."
      },
      {
        id: "lo1-17",
        question: "What device uses artificial gravity and centrifugal forces to classify fine gold or heavy PGMs from light quartz sand slurry?",
        options: [
          "Jaw crusher cavity",
          "Knelson Concentrator",
          "Sinter conveyor strand",
          "Dry sieve grade deck"
        ],
        correctIndex: 1,
        explanation: "Knelson Concentrators are high-G centrifugal gravity separation devices that trap heavy elements (Gold, Platinum) in water-jacketed fluid beds, forcing out light silica."
      },
      {
        id: "lo1-18",
        question: "Which of the following defines the term 'Run-of-Mine' (ROM) in raw material processing?",
        options: [
          "Ore processed at 1500°C in the active plant",
          "Raw mined material in bulk prior to any crushing or screening treatment",
          "Liquid slag tapped from the blast furnace bottom",
          "Chemical pulp ready for differential flotation"
        ],
        correctIndex: 1,
        explanation: "ROM refers to the raw, unprocessed mined material exactly as it comes out of the ground, containing rocks of all sizes and accompanying gangue."
      },
      {
        id: "lo1-19",
        question: "Under the classical Bohr atomic model, which electron shell transition in a hydrogenic state releases the highest energy photon?",
        options: ["n=3 to n=2", "n=4 to n=3", "n=2 to n=1", "n=5 to n=4"],
        correctIndex: 2,
        explanation: "The energy difference between shell levels decreases as n increases. The transition from n=2 to n=1 spans the largest energy gap, emitting a high-frequency ultraviolet photon."
      },
      {
        id: "lo1-20",
        question: "What secondary toxic gaseous product derived from roasting copper sulfide ores must be captured to protect the atmosphere?",
        options: [
          "Siderite gas",
          "Sulfur dioxide (SO2)",
          "Nitrogen dioxide (NO2)",
          "Carbon monoxide (CO)"
        ],
        correctIndex: 1,
        explanation: "Roasting sulfidic ores releases sulfur dioxide (SO2) gas. Modern plants capture and convert SO2 into vital sulfuric acid to prevent dangerous atmospheric pollution."
      }
    ]
  },
  {
    id: "lo2-prepare-burden",
    title: "LO2: Formulate & Prepare Sinter Burden",
    subject: "Burden Preparation",
    difficulty: "Advanced",
    badge: "Burden Charge Leader",
    badgeLevel: "LO2 Verified",
    questions: [
      {
        id: "lo2-1",
        question: "What is the primary operational purpose of adding limestone (CaCO3) as a flux constituent during iron ore blast furnace burden preparation?",
        options: [
          "To reduce the iron oxide to molten iron metal directly",
          "To react with silica impurities (SiO2) to form fusible slag",
          "To increase the heating value of the carbonaceous coke",
          "To act as a structural binder for pelletizing green state balls"
        ],
        correctIndex: 1,
        explanation: "Limestone acts as a flux. In the smelting furnace, it decomposes to lime (CaO), which reacts with acidic silica grains (SiO2) to form calcium silicate slag (CaSiO3). This slag has a low melting point and can be cleanly separated from the molten metal."
      },
      {
        id: "lo2-2",
        question: "Which size reduction machinery is most commonly set up in the initial stage of mineral processing to crush large run-of-mine ore rocks through compression?",
        options: [
          "Ball Mill with steel balls",
          "Jaw Crusher with compression plates",
          "Sintering Strand belt",
          "Froth Flotation cell banks"
        ],
        correctIndex: 1,
        explanation: "A jaw crusher is the premier primary crushing machine that uses heavy compressive forces to break large ores down. It squeezes metallurgical rocks between a fixed plate and a pivoting jaw."
      },
      {
        id: "lo2-3",
        question: "During sinter formulation, a metallurgical charge requires a coke-to-ore proportion of exactly 5.0%. If you are preparing a test burden containing 1500 kg of dry iron ore, what mass of carbonaceous coke must be weighed?",
        options: ["75 kg", "150 kg", "300 kg", "7.5 kg"],
        correctIndex: 0,
        explanation: "Calculated coke mass = Ore mass * Coke ratio = 1500 kg * 5.0% = 1500 * 0.05 = 75 kg coke."
      },
      {
        id: "lo2-4",
        question: "Which agglomeration method utilizes moisture and disk-rolling pelletizers to convert ultra-fine concentrate particles into wet spherical balls, which are then baked in induration furnaces?",
        options: [
          "Agglomerative Sintering",
          "Cold Briquetting",
          "Damp Drum Pelletizing",
          "Fine Sand Milling"
        ],
        correctIndex: 2,
        explanation: "Pelletizing is the process of rolling damp fine iron ore concentrate (with binders like bentonite) into green spherical pellets, which are then hardened by thermal baking to withstand furnace mechanical loads."
      },
      {
        id: "lo2-5",
        question: "Under standard operating procedures (SOP) in weighing burdens, which step must occur immediately before weighing raw material outputs to maintain data integrity?",
        options: [
          "Record the annual metallurgy report first",
          "Tare the calibration balance to zero while empty",
          "Double the feed conveyor motors rate",
          "Mix sintering water binders at 1200°C"
        ],
        correctIndex: 1,
        explanation: "Taring the balance to zero while empty ensures that the chemical sample container weight behaves neutrally and only the precise net weight of the raw metallurgical burden material is recorded."
      },
      {
        id: "lo2-6",
        question: "What is the typical target moisture content percentage for preparing a green sinter mixture to ensure optimal bed permeability on the sinter strand?",
        options: [
          "1.0% - 2.0%",
          "6.0% - 8.0%",
          "15.0% - 20.0%",
          "30.0% - 35.0%"
        ],
        correctIndex: 1,
        explanation: "Sinter mixtures require about 6.0% to 8.0% moisture to optimize capillary micro-granulation. Excessive water floods voids, while too little inhibits compaction."
      },
      {
        id: "lo2-7",
        question: "Why is a portion of recycled 'return sinter' (fines screened under 5mm) regularly blended back into the new sinter burden raw feed?",
        options: [
          "To lower the sintering zone combustion temperature",
          "To serve as rugged nucleation points and improve bed porosity",
          "To chemically extract trace chromium ores",
          "To absorb surface hydrogen gases instantly"
        ],
        correctIndex: 1,
        explanation: "Recycling return sinter fines acts as nuclei that collect fine feed grains during moisture micro-granulation. This improves the bed structure and ensures smooth draft air flow."
      },
      {
        id: "lo2-8",
        question: "If your sinter mix demands exactly 3.5 kg of bentonite binder for every 500 kg of dry concentrate, what is the weight percentage of the binder?",
        options: ["0.15%", "0.35%", "0.70%", "1.40%"],
        correctIndex: 2,
        explanation: "Bentonite binder ratio is: (3.5 kg / 500 kg) * 100% = 0.007 * 100% = 0.70% by weight."
      },
      {
        id: "lo2-9",
        question: "In sinter bed operations, what is the purpose of placing a hearth layer of pre-sintered lumps directly on the steel grate bars?",
        options: [
          "To add extra chemical fuel to the bottom",
          "To protect the grate bars from temperature shock and prevent dust drop-down",
          "To block oxygen from entering the suction boxes",
          "To completely liquefy the bottom iron concentrate"
        ],
        correctIndex: 1,
        explanation: "The hearth layer protects the underlying grate bars from structural thermal stress (1200-1300°C) and prevents fine grains from slipping down into high-vacuum windboxes."
      },
      {
        id: "lo2-10",
        question: "Which chemical compound represents active 'lime', which is obtained by calcining mineral limestone fluxes in burden prep?",
        options: ["CaSO4", "CaO", "Ca(OH)2", "CaCO3"],
        correctIndex: 1,
        explanation: "Calcium carbonate (CaCO3) decomposes above 900°C (calcination), releasing gaseous carbon dioxide and leaving reactive basic calcium oxide (CaO), or lime."
      },
      {
        id: "lo2-11",
        question: "If your sintering charge contains 1200 kg of iron ore, 180 kg of flux, and 60 kg of coke, what is the flux-to-ore weight ratio as a percentage?",
        options: ["5.0%", "15.0%", "20.0%", "25.0%"],
        correctIndex: 1,
        explanation: "Flux-to-ore weight ratio = (180 kg flux / 1200 kg iron ore) * 100% = 0.15 * 100% = 15.0%."
      },
      {
        id: "lo2-12",
        question: "Which binder is widely preferred in PGM and iron pelletization due to its unique thermal swelling and moisture retention Montmorillonite structure?",
        options: [
          "Portland cement matrix",
          "Bentonite clay",
          "Pure silica sand",
          "Hydrated calcium paste"
        ],
        correctIndex: 1,
        explanation: "Bentonite clay absorbs high quantities of water within its montmorillonite sheet structure, creating durable capillary bridges that hold dry grains together."
      },
      {
        id: "lo2-13",
        question: "What is the primary operational penalty associated with introducing a sinter burden featuring excessive Silica (SiO2) impurities?",
        options: [
          "Sudden physical combustion of conveyor rollers",
          "Excessive volumes of viscous slag lowering iron recovery rate",
          "Sintering material sublimating into gas",
          "An immediate rise in moisture percentages"
        ],
        correctIndex: 1,
        explanation: "High silica requires massive additions of basic limestone flux to maintain bascity. This creates large volumes of slag which consume thermal energy and entrap metal."
      },
      {
        id: "lo2-14",
        question: "In green-state briquetting, what mechanic is primarily utilized to press moist fine ores into uniform metallurgical briquettes?",
        options: [
          "Aeration cyclones",
          "Turbulent froth stirring",
          "High-pressure pocketed double-roll presses",
          "Strong acid bath solvation"
        ],
        correctIndex: 2,
        explanation: "Roll briquetting uses heavy mechanical compression of double-roll machines, squeezing loose particles in pocket profiles to produce robust density lumps."
      },
      {
        id: "lo2-15",
        question: "If a dynamic feeder conveys base iron ore at 250 tonnes per hour, and the target coke additions feeder tracks at 12.5 tonnes per hour, what is the fuel addition percentage?",
        options: ["2.5%", "5.0%", "7.5%", "10.0%"],
        correctIndex: 1,
        explanation: "Fuel additions percentage = (12.5 / 250) * 100% = 0.05 * 100% = 5.0%."
      },
      {
        id: "lo2-16",
        question: "Why is 'coke breeze' preferred over chunk coal blocks as the primary fuel source built into sinter feed beds?",
        options: [
          "It has a lower flash ignition temperature",
          "Its fine particle sizing (under 3mm) ensures uniform distribution throughout the bed",
          "It lowers nitrogen dioxide by-products",
          "It acts as a primary supplier of moisture"
        ],
        correctIndex: 1,
        explanation: "Fine coke breeze (0-3mm size) distributes evenly throughout the granulated raw mix. This guarantees uniform local heating as the flame front moves down."
      },
      {
        id: "lo2-17",
        question: "Which term describes the process where heated dry powder particles partially diffuse and fuse into a single tough porous structure without liquefying?",
        options: ["Smelting", "Sintering", "Calcination", "Hydrometallurgy"],
        correctIndex: 1,
        explanation: "Sintering binds fine solids by heating below their melting point, promoting solid-state chemical diffusion to construct stable porous furnace charge lumps."
      },
      {
        id: "lo2-18",
        question: "When blending a sinter burden, what is the immediate consequence of introducing too much slurry water (e.g., above 12.0%)?",
        options: [
          "Severe explosive chemical combustion of the bed",
          "Decreased mechanical strain on the exhaust vacuum fan",
          "Bed collapsing into dense mud and choking down draft air flow",
          "Direct conversion of limestone into raw hydrogen"
        ],
        correctIndex: 2,
        explanation: "Excessive water destroys crumbly granulation, turning the sinter mix into a mud barrier. This seals voids, choking air suction necessary for fuel burning."
      },
      {
        id: "lo2-19",
        question: "If your sintering test burden demands a target dry weight of exactly 3000 kg and the limestone flux ratio is set at 8.0%, what mass of dry flux agent should be loaded?",
        options: ["80.0 kg", "240.0 kg", "400.0 kg", "24.0 kg"],
        correctIndex: 1,
        explanation: "Determined weight = Total Dry Weight * Flux ratio = 3000 kg * 8.0% = 240.0 kg."
      },
      {
        id: "lo2-20",
        question: "Which of the following describes 'green pellets' in metallurgical burden preparation?",
        options: [
          "Pellets colored with safe botanical indicators",
          "Damp, unbaked pellets that have just emerged from rolling disc pelletizers",
          "Pellets composed of metallic element nickel complexes",
          "Pellets which have completed thermal firing at 1300°C"
        ],
        correctIndex: 1,
        explanation: "In mineral dressing, 'green' indicates raw, damp agglomerated items that have not yet undergone thermal baking or induration curing."
      }
    ]
  },
  {
    id: "lo3-machine-setup",
    title: "LO3: Carryout Mineral Machine Setup",
    subject: "Machine Setup & SHEQ",
    difficulty: "Advanced",
    badge: "Operations Captain",
    badgeLevel: "LO3 Verified",
    questions: [
      {
        id: "lo3-1",
        question: "What does the abbreviation SHEQ represent in standard industrial metallurgical operating environments and machine setup codes?",
        options: [
          "Scientific Heating, Extraction and Quality",
          "Safety, Health, Environment and Quality",
          "Slag Height, Equilibrium and Quenching",
          "Sieve Hopper, Excavator and Quarrying"
        ],
        correctIndex: 1,
        explanation: "SHEQ stands for Safety, Health, Environment, and Quality. This program ensures that operators execute machine setup in a secure environment while respecting standards and reducing accident rates."
      },
      {
        id: "lo3-2",
        question: "Which tool or method is standardly used to calibrate the flow rate of wet pulp slurry being pumped into a froth flotation separator machine?",
        options: [
          "Laboratory dry sieve grading screens",
          "Electromagnetic flow meters with physical bucket-and-stopwatch checks",
          "Optical microscope diffraction grids",
          "Standard dial thermocouple thermometers"
        ],
        correctIndex: 1,
        explanation: "Slurry feed pipe flow validation relies on electromagnetic sensors verified with physical volume bucket-and-stopwatch timed checks to offset viscosity errors on raw material throughput."
      },
      {
        id: "lo3-3",
        question: "During the setup of a magnetic separator machine, what is the primary variable that must be calibrated to ensure non-magnetic silica gangue is cleanly separated from highly magnetic magnetite (Fe3O4)?",
        options: [
          "Acid reagents pH volume ratio",
          "Drum rotational speed and magnetic field intensity (Amperage)",
          "Crushing plate gap size and moisture",
          "Water temperature and oxygen pressure parameters"
        ],
        correctIndex: 1,
        explanation: "To cleanly extract magnetic magnetite from silica gangue, magnetic separators require exact calibration of the magnetic field intensity (controlled by coil Amperage) and drum rotational speed."
      },
      {
        id: "lo3-4",
        question: "Under standard safety parameters, what is the main occupational hazard of operating dry rock mills or jaw crushers without active dust extraction systems?",
        options: [
          "Hydrogen gas combustion explosions",
          "Inhalation of respirable crystalline silica dust (silicosis risk)",
          "Acid runoff leaching base metals from solid rock",
          "Spontaneous radioactive decay of the steel charge"
        ],
        correctIndex: 1,
        explanation: "Dry milling and crushing generate substantial levels of finely divided crystalline silica dust. Without confinement or active dust extraction, operators face critical risks of silicosis and chronic lung disease."
      },
      {
        id: "lo3-5",
        question: "When calibrating automated weighing belts that convey burden elements to a sintering plant, why is it standard practice to carry out a static 'tare weight test' followed by a dynamic 'chain run loop test'?",
        options: [
          "To test if the conveyor belt matches the chemical stoichiometry of Bohr atoms",
          "To calibrate for uneven belt thickness, joint weights, and resistance forces in motion",
          "To check if the iron ore concentrate will undergo SN2 backside attack",
          "To measure the acid pH buffering balance of the conveyer steel alloy"
        ],
        correctIndex: 1,
        explanation: "A dynamic test with a calibration chain of known weight calibrates the scale belt under real moving conditions, adjusting for variations in belt thickness, tension, joints, and rotational friction errors."
      },
      {
        id: "lo3-6",
        question: "Under standard Lockout-Tagout (LOTO) SHEQ guidelines, what must an operator perform first before executing internal maintenance in a jaw crusher cavity?",
        options: [
          "Liberally lubricate the crushing jaw toggle plate",
          "Shut off the dust suppression water sprays",
          "Isolate the main electrical feed and padlock the isolator with their personal key",
          "Open the gap width adjustment hydraulic toggle completely"
        ],
        correctIndex: 2,
        explanation: "LOTO requires disconnecting the main electricity break and securing it with an individual padlock. Only the technician holding the key can unlock it, preventing accidental start-ups."
      },
      {
        id: "lo3-7",
        question: "If a wet froth flotation separator shows high gangue entrapment in the concentrate weir, what chemical addition rates must the operator calibrate?",
        options: [
          "The density of dense media clay fluids",
          "The dosage of frothers and collectors/depressants",
          "Magnetic field drum coil voltage",
          "The bentonite weight ratio"
        ],
        correctIndex: 1,
        explanation: "Frother additions control bubble thickness and stability. Excess frothers preserve tough bubbles that hold untargeted gangue, reducing clean concentrate grade."
      },
      {
        id: "lo3-8",
        question: "What document is mandatory under SHEQ compliance for an operator to complete before executing any mechanical crusher setup changes?",
        options: [
          "Quarterly mineral invoice",
          "Job Safety Analysis (JSA) / Written Risk Assessment",
          "Corporate parts procurement guide",
          "Yearly furnace thermal balance spreadsheet"
        ],
        correctIndex: 1,
        explanation: "A Job Safety Analysis (JSA) identifies key steps, corresponding hazards, and safety actions to protect personnel from injury during heavy machinery adjustments."
      },
      {
        id: "lo3-9",
        question: "Why does a ball mill's grinding throughput decline sharply when internal steel balls are excessively worn down in diameter?",
        options: [
          "The charge absorbs moisture too rapidly",
          "Reduced surface area of contact and weaker kinetic impact forces",
          "The mill motor begins spinning below 10 RPM",
          "Limestone flux becomes highly acidic"
        ],
        correctIndex: 1,
        explanation: "Milling relies on mechanical impacts and rubbing of cascading balls. Worn, smaller balls yield less kinetic impact force and contact surface, failing to break hard rock grains."
      },
      {
        id: "lo3-10",
        question: "When configuring a rotary grinding mill, what is 'Critical Speed' designed to define?",
        options: [
          "The rotational speed where centrifugal force pins grinding balls to the drum shell, stopping cascade tumbling",
          "The maximum safe speed of the belt conveyor feed motor",
          "The speed of gravity falling in hydrocyclone separation grids",
          "The speed where ore feed begins to melt due to friction"
        ],
        correctIndex: 0,
        explanation: "Critical speed is where centrifugal force keeps the ball charge pinned to the mill wall, stopping the cascading action. Rotary mills typically run at 70% to 78% of critical speed."
      },
      {
        id: "lo3-11",
        question: "What protective gear (PPE) is mandatory when adjusting xanthate collector pipes on the flotation circuit?",
        options: [
          "Heavy leather welding apron",
          "Reflective safety bib and soft plastic caps",
          "Chemical goggles, heavy-duty nitrile gloves, and splash-guard aprons",
          "Felt safety mittens and standard spectacles"
        ],
        correctIndex: 2,
        explanation: "Industrial collectors are toxic chemical compounds. Wearing solvent-resistant gloves, splash aprons, and seal goggles prevents skin contact and eye splash hazards."
      },
      {
        id: "lo3-12",
        question: "When calibrating a hydrocyclone particle separator, which variable is changed to adjust the particle size separation cut-point (d50)?",
        options: [
          "High frequency mill coil amps",
          "Diameter of the spigot/apex nozzle and vortex finder width",
          "Slope angle of the dynamic sorting belt",
          "The steel composition of the tumbling balls"
        ],
        correctIndex: 1,
        explanation: "Altering the vortex finder and lower apex nozzles changes internal pulp flow dynamics, regulating the separation of fine overflow from coarse underflow."
      },
      {
        id: "lo3-13",
        question: "If an electronic conveyor belt scale registers drift errors due to vibrations from heavy nearby grading screens, what setup action is necessary?",
        options: [
          "Boost the belt drive motor voltage",
          "Install isolators, vibration dampeners, or relocate the weighing frame",
          "Lubricate scale rollers twice every shift",
          "Accept the error and manually adjust inputs later"
        ],
        correctIndex: 1,
        explanation: "Heavy structural vibrations add erratic noise to dynamic load cells. Mechanical isolation or relocation is the primary means to restore steady, precise mass readings."
      },
      {
        id: "lo3-14",
        question: "What is indicated by a loud low-pitched vibration accompanied by high heat from a jaw crusher's main eccentric bearing?",
        options: [
          "Perfect mechanical gap calibration",
          "Severe bearing wear or complete lack of high-pressure lubricant grease",
          "Normal alloy behavior under full compression load",
          "The iron ore material is too high in moisture"
        ],
        correctIndex: 1,
        explanation: "Low-frequency hums and sudden temperature spikes indicate extreme metal-on-metal friction. This points to bearing degradation or missing heavy load lubricants."
      },
      {
        id: "lo3-15",
        question: "What is the primary function of a mechanical 'trommel screen' fitted at the exit of a wet mill drum?",
        options: [
          "To dry out the discharged wet pulp",
          "To catch broken grinding balls and protect downstream slurry pumps from catastrophic damage",
          "To perform chemical assay balances on copper content",
          "To align particle magnetic moments"
        ],
        correctIndex: 1,
        explanation: "Trommel screens act as revolving strainers, separating iron ball scraps and rocks before they enter slurry sumps, avoiding mechanical pump failures."
      },
      {
        id: "lo3-16",
        question: "Under environmental management standards, how must barren tailing slurry outflows be handled?",
        options: [
          "Discharged directly into local rivers to dilute the chemicals",
          "Directed to secure tailing storage dams for water decanting and heavy solid consolidation",
          "Burned in high-temperature blast ovens",
          "Recycled directly into the primary jaw crusher feed"
        ],
        correctIndex: 1,
        explanation: "Mined tailings contain processed mineral residues and chemicals. Secure tailings dams prevent environmental leaching and decant clean water back to the factory."
      },
      {
        id: "lo3-17",
        question: "What occurs if a magnetic separator drum speed is calibrated far above its maximum specified RPM?",
        options: [
          "Slurry pulp will immediately crystallize",
          "Valuable magnetic minerals are thrown off by centrifugal force directly into tailings",
          "Silica gangue grains will bind to the drum",
          "The permanent magnet array becomes demagnetized"
        ],
        correctIndex: 1,
        explanation: "At excessive speeds, centrifugal forces exceed the magnetic hold. Valuable magnetic minerals fly off early, reducing extraction recovery."
      },
      {
        id: "lo3-18",
        question: "When installing a heavy ore belt conveyor, what device is adjusted to combat belt wander and edge fraying?",
        options: [
          "Centrifugal hydrocyclone",
          "Self-aligning tracking idlers",
          "Vortex classification nozzle",
          "Electrostatic dust hoods"
        ],
        correctIndex: 1,
        explanation: "Self-aligning tracking idlers pivot to guide a misaligned belt section back to the center of the structure, avoiding frame wear."
      },
      {
        id: "lo3-19",
        question: "Under SHEQ safety rules, what is the maximum continuous decibel (dB) sound level an operator may work near without ear protection?",
        options: ["85 dB", "120 dB", "140 dB", "50 dB"],
        correctIndex: 0,
        explanation: "OSHA codes restrict continuous 8-hour exposure to a maximum of 85 dB. Higher noise levels mandate earplugs or ear defenders to protect hearing."
      },
      {
        id: "lo3-20",
        question: "Which parameters are regulated in a spiral classifier weir to refine the particle cut size of the overflow slurry?",
        options: [
          "Hardness of grinding balls",
          "Pulp density (water ratio) and spiral shaft rotational speed",
          "Magnetic separator drum field intensity",
          "Coke combustion temperature profiles"
        ],
        correctIndex: 1,
        explanation: "Fine pulp classification is governed by fluid buoyancy and settlement speed. Controlling the water ratio (pulp density) and rotation speed directly refines particle dimensions."
      }
    ]
  }
];
