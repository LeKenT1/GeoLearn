window.GL = window.GL || {};

// Culture facts: 3 facts per country, bilingual (fr / en)
// GL.CULTURE_FACTS[countryCode] = { fr: [...3 strings], en: [...3 strings] }

GL.CULTURE_FACTS = {

  // ===== EUROPE =====
  'fr': {
    fr: ["Première puissance touristique mondiale", "Berceau de la Déclaration des Droits de l'Homme (1789)", "A offert la Statue de la Liberté aux États-Unis"],
    en: ["World's leading tourist destination", "Birthplace of the Declaration of Human Rights (1789)", "Gifted the Statue of Liberty to the United States"]
  },
  'de': {
    fr: ["Inventeur de l'imprimerie à caractères mobiles (Gutenberg, 1450)", "Pays avec la plus grande concentration de brasseries au monde", "Berceau de la Réforme protestante avec Martin Luther"],
    en: ["Invented the movable type printing press (Gutenberg, 1450)", "Home to the world's greatest concentration of breweries", "Birthplace of the Protestant Reformation with Martin Luther"]
  },
  'it': {
    fr: ["Berceau de la Renaissance européenne", "Pays avec le plus grand nombre de sites du patrimoine UNESCO en Europe", "A inventé le piano à Florence au XVIIIe siècle"],
    en: ["Birthplace of the European Renaissance", "Country with the most UNESCO World Heritage Sites in Europe", "Invented the piano in Florence in the 18th century"]
  },
  'es': {
    fr: ["A colonisé la majeure partie de l'Amérique du Sud au XVIe siècle", "Deuxième pays le plus visité au monde (avant la pandémie)", "Deuxième langue maternelle la plus parlée au monde, derrière le mandarin"],
    en: ["Colonized most of South America in the 16th century", "Second most visited country in the world (pre-pandemic)", "Has the world's second most spoken native language, after Mandarin"]
  },
  'pt': {
    fr: ["A eu le plus grand empire maritime de l'histoire pendant deux siècles", "Inventeur de la caravelle, navire qui révolutionna l'exploration maritime", "A colonisé le Brésil, l'Angola, le Mozambique et le Cap-Vert"],
    en: ["Had the world's largest maritime empire for two centuries", "Invented the caravel ship that revolutionized maritime exploration", "Colonized Brazil, Angola, Mozambique and Cape Verde"]
  },
  'gb': {
    fr: ["Berceau de la Révolution industrielle au XVIIIe siècle", "Ancien empire qui contrôlait un quart de la surface terrestre", "A codifié les règles du football moderne (Football Association, 1863)"],
    en: ["Birthplace of the Industrial Revolution in the 18th century", "Once an empire controlling a quarter of Earth's land surface", "Codified the rules of modern football (Football Association, 1863)"]
  },
  'nl': {
    fr: ["A inventé le télescope et le microscope au XVIIe siècle", "Un tiers du pays se trouve sous le niveau de la mer", "Premier pays au monde à légaliser le mariage homosexuel (2001)"],
    en: ["Invented both the telescope and microscope in the 17th century", "A third of the country lies below sea level", "First country in the world to legalize same-sex marriage (2001)"]
  },
  'be': {
    fr: ["A inventé les frites malgré leur nom « French Fries »", "Produit plus de 1 500 types de bières différentes", "Siège de la Commission européenne, du Parlement européen et du quartier général de l'OTAN"],
    en: ["Invented French fries, despite the name", "Produces over 1,500 different types of beer", "Headquarters of the European Commission, the European Parliament, and NATO"]
  },
  'ch': {
    fr: ["A fondé la Croix-Rouge internationale (Henri Dunant, 1863)", "Pays le plus neutre politiquement au monde depuis 1815", "Produit les montres les plus renommées au monde"],
    en: ["Founded the International Red Cross (Henri Dunant, 1863)", "World's most politically neutral country since 1815", "Produces the world's most prestigious watches"]
  },
  'at': {
    fr: ["Berceau de Mozart, Schubert, Haydn et Beethoven (qui y a vécu)", "A gouverné l'Europe pendant des siècles via la dynastie des Habsbourg", "Berceau de la psychanalyse (Sigmund Freud, Vienne)"],
    en: ["Birthplace of Mozart, Schubert, and Haydn (Beethoven also lived here)", "Ruled Europe for centuries through the Habsburg dynasty", "Birthplace of psychoanalysis (Sigmund Freud, Vienna)"]
  },
  'pl': {
    fr: ["Berceau de Nicolas Copernic, qui a prouvé que la Terre tourne autour du Soleil", "Pays de Marie Curie, seule personne à avoir deux Prix Nobel dans des sciences différentes", "A subi la plus grande perte humaine relative de la Seconde Guerre mondiale"],
    en: ["Birthplace of Nicolaus Copernicus, who proved Earth orbits the Sun", "Home to Marie Curie, the only person to win two Nobel Prizes in different sciences", "Suffered the greatest proportional human loss in World War II"]
  },
  'cz': {
    fr: ["A inventé les lentilles de contact souples (Otto Wichterle, 1961)", "Pays avec la consommation de bière per capita la plus élevée au monde", "Sa capitale est surnommée « la Ville aux cent clochers » pour ses innombrables flèches gothiques"],
    en: ["Invented soft contact lenses (Otto Wichterle, 1961)", "Country with the world's highest per capita beer consumption", "Its capital is nicknamed 'the City of a Hundred Spires' for its countless Gothic spires"]
  },
  'se': {
    fr: ["Berceau de l'inventeur de la dynamite Alfred Nobel (fondateur du Prix Nobel)", "A inventé le pacemaker cardiaque, le Bluetooth et l'abri zipper", "Premier pays au monde à garantir la liberté de la presse (1766)"],
    en: ["Birthplace of dynamite inventor Alfred Nobel (founder of the Nobel Prize)", "Invented the cardiac pacemaker, Bluetooth, and the safety match", "First country in the world to guarantee freedom of the press (1766)"]
  },
  'no': {
    fr: ["A atteint l'Amérique du Nord 500 ans avant Christophe Colomb (Leif Erikson)", "Régulièrement classé pays le plus heureux du monde", "A inventé le coupe-fromage (Julius Kayser, 1925)"],
    en: ["Reached North America 500 years before Columbus (Leif Erikson)", "Regularly ranked the world's happiest country", "Invented the cheese slicer (Julius Kayser, 1925)"]
  },
  'dk': {
    fr: ["Berceau de Hans Christian Andersen, auteur de La Petite Sirène", "A inventé le Lego (Ole Kirk Christiansen, 1932)", "Premier pays à légaliser le partenariat civil homosexuel (1989)"],
    en: ["Birthplace of Hans Christian Andersen, author of The Little Mermaid", "Invented Lego (Ole Kirk Christiansen, 1932)", "First country to legalize same-sex civil partnerships (1989)"]
  },
  'fi': {
    fr: ["Pays de Nokia (téléphone portable) et de Linux (Linus Torvalds)", "Pays avec le plus grand nombre de lacs au monde (188 000 lacs)", "A eu le meilleur système éducatif du monde selon l'OCDE pendant plusieurs années"],
    en: ["Home of Nokia (mobile phone) and Linux (Linus Torvalds)", "Country with the world's most lakes (188,000 lakes)", "Ranked world's best education system by the OECD for several years"]
  },
  'gr': {
    fr: ["Berceau de la démocratie, de la philosophie et des Jeux Olympiques", "A contribué plus de 150 000 mots à la langue anglaise", "Civilisation qui a fondé la médecine, les mathématiques et la physique modernes"],
    en: ["Birthplace of democracy, philosophy, and the Olympic Games", "Contributed over 150,000 words to the English language", "Civilization that founded modern medicine, mathematics, and physics"]
  },
  'tr': {
    fr: ["Seul pays au monde à chevaucher deux continents (Europe et Asie)", "Berceau de la cerise : le mot vient de Giresun (anciennement Kerasus)", "A abrité la première cafégothèque du monde, ouverte en 1554"],
    en: ["Only country in the world straddling two continents (Europe and Asia)", "Birthplace of the cherry: the word comes from Giresun (ancient Cerasus)", "Home to the world's first coffeehouse, opened in 1554"]
  },
  'ru': {
    fr: ["Plus grand pays du monde, couvrant 11 fuseaux horaires", "A lancé le premier satellite artificiel (Spoutnik, 1957) et envoyé le premier homme dans l'espace", "Le lac Baïkal contient 20 % des réserves mondiales d'eau douce de surface"],
    en: ["World's largest country, spanning 11 time zones", "Launched the first artificial satellite (Sputnik, 1957) and sent the first human to space", "Lake Baikal contains 20% of the world's surface fresh water"]
  },
  'ua': {
    fr: ["Grenier à blé de l'Europe et premier exportateur mondial d'huile de tournesol", "Sa capitale est l'une des plus anciennes d'Europe de l'Est, fondée au IXe siècle", "Possède la plus grande centrale nucléaire d'Europe (Zaporijjia)"],
    en: ["Europe's breadbasket and world's largest sunflower oil exporter", "Its capital is one of the oldest cities in Eastern Europe, founded in the 9th century", "Home to Europe's largest nuclear power plant (Zaporizhzhia)"]
  },
  'ro': {
    fr: ["Berceau du mythe de Dracula (inspiré du prince Vlad l'Empaleur)", "Pays de Nadia Comăneci, première gymnaste à obtenir un 10 parfait aux JO (1976)", "A la forêt de Hoia Baciu, considérée comme la forêt la plus hantée du monde"],
    en: ["Birthplace of the Dracula legend (inspired by Prince Vlad the Impaler)", "Home to Nadia Comăneci, first gymnast to score a perfect 10 at the Olympics (1976)", "Home to the Hoia Baciu forest, considered the world's most haunted forest"]
  },
  'hu': {
    fr: ["A inventé le Rubik's Cube (Ernő Rubik, 1974)", "Produit plus de champions du monde d'échecs par habitant que tout autre pays", "Sa langue, le hongrois, ne ressemble à aucune autre langue d'Europe occidentale"],
    en: ["Invented the Rubik's Cube (Ernő Rubik, 1974)", "Produces more chess world champions per capita than any other country", "Its language, Hungarian, is unlike any other Western European language"]
  },
  'hr': {
    fr: ["A inventé la cravate, accessoire vestimentaire adopté dans toute l'Europe au XVIIe siècle", "Berceau supposé de Marco Polo (île de Korčula)", "Ses chutes de Plitvice figurent parmi les plus belles d'Europe"],
    en: ["Invented the necktie, a fashion accessory adopted throughout Europe in the 17th century", "Claimed birthplace of Marco Polo (island of Korčula)", "Its Plitvice Lakes are among the most beautiful waterfalls in Europe"]
  },
  'ie': {
    fr: ["Pays d'origine d'Halloween (issu de la fête celtique de Samhain)", "Premier pays à légaliser le mariage homosexuel par référendum populaire (2015)", "A subi la Grande Famine de 1845 qui a réduit sa population de moitié"],
    en: ["Origin of Halloween (from the Celtic festival of Samhain)", "First country to legalize same-sex marriage by popular referendum (2015)", "Suffered the Great Famine of 1845 which halved its population"]
  },
  'is': {
    fr: ["A le plus vieux parlement au monde encore en activité (l'Althing, fondé en 930)", "Premier pays à avoir élu une femme présidente (Vigdís Finnbogadóttir, 1980)", "Fonctionne à quasiment 100 % en énergies renouvelables (géothermie et hydroélectricité)"],
    en: ["Has the world's oldest active parliament (the Althing, founded in 930 AD)", "First country to elect a woman as head of state (Vigdís Finnbogadóttir, 1980)", "Runs on nearly 100% renewable energy (geothermal and hydroelectric)"]
  },
  'rs': {
    fr: ["Berceau de Nikola Tesla, inventeur du courant alternatif (AC)", "Pays natal de Novak Djokovic, considéré comme le plus grand joueur de tennis de tous les temps", "A eu la plus vieille cathédrale orthodoxe d'Europe (Église Saint-Pierre à Ras)"],
    en: ["Birthplace of Nikola Tesla, inventor of alternating current (AC)", "Home to Novak Djokovic, widely considered the greatest tennis player of all time", "Had one of the oldest Orthodox cathedrals in Europe (St. Peter's Church in Ras)"]
  },

  // ===== AMERICAS =====
  'us': {
    fr: ["Premier pays à avoir marché sur la Lune (Apollo 11, juillet 1969)", "A inventé l'internet, le cinéma hollywoodien et les réseaux sociaux", "Économie la plus puissante du monde depuis plus d'un siècle"],
    en: ["First country to land on the Moon (Apollo 11, July 1969)", "Invented the internet, Hollywood cinema, and social media", "World's most powerful economy for over a century"]
  },
  'ca': {
    fr: ["Deuxième plus grand pays du monde en superficie", "A inventé le hockey sur glace, le basketball et le Trivial Pursuit", "Possède la plus longue côte maritime du monde (202 080 km)"],
    en: ["Second largest country in the world by area", "Invented ice hockey, basketball, and Trivial Pursuit", "Has the world's longest coastline (202,080 km)"]
  },
  'br': {
    fr: ["Abrite la forêt amazonienne, qui produit 20 % de l'oxygène de la planète", "Cinq fois champion du monde de football (1958, 1962, 1970, 1994, 2002)", "Plus grand pays d'Amérique du Sud, 5e au monde par la superficie"],
    en: ["Home to the Amazon rainforest, producing 20% of the planet's oxygen", "Five-time Football World Cup champion (1958, 1962, 1970, 1994, 2002)", "Largest country in South America, 5th largest in the world by area"]
  },
  'ar': {
    fr: ["Berceau du tango, inscrit au patrimoine immatériel de l'UNESCO", "Pays de Lionel Messi, champion du monde de football en 2022", "A le plus grand glacier non polaire du monde (Perito Moreno, Patagonie)"],
    en: ["Birthplace of the tango, recognized on UNESCO's intangible heritage list", "Home of Lionel Messi, 2022 Football World Cup champion", "Has the world's largest non-polar glacier (Perito Moreno, Patagonia)"]
  },
  'mx': {
    fr: ["Berceau du chocolat, inventé par les Mayas et les Aztèques", "Abrite les pyramides aztèques dont Teotihuacán", "Premier producteur mondial d'avocats"],
    en: ["Birthplace of chocolate, invented by the Maya and Aztecs", "Home to Aztec pyramids including Teotihuacán", "World's top avocado producer"]
  },
  'co': {
    fr: ["Premier producteur mondial de fleurs coupées après les Pays-Bas", "Berceau de Gabriel García Márquez, père du réalisme magique", "Produit 70-90 % des émeraudes mondiales"],
    en: ["World's second largest cut flower producer after the Netherlands", "Birthplace of Gabriel García Márquez, father of magical realism", "Produces 70-90% of the world's emeralds"]
  },
  'pe': {
    fr: ["Berceau de la civilisation inca et du Machu Picchu", "Origine de la pomme de terre, qui a révolutionné l'alimentation mondiale", "L'un des pays les plus riches en biodiversité au monde"],
    en: ["Birthplace of the Inca civilization and Machu Picchu", "Origin of the potato, which revolutionized world nutrition", "One of the world's most biodiverse countries"]
  },
  'cl': {
    fr: ["Pays le plus long du monde : 4 300 km du nord au sud", "Abrite le désert d'Atacama, le plus aride de la planète", "Abrite l'Observatoire astronomique européen, le plus grand du monde (ESO)"],
    en: ["World's longest country: 4,300 km from north to south", "Home to the Atacama Desert, the driest place on Earth", "Home to the European Southern Observatory, the world's largest (ESO)"]
  },
  'cu': {
    fr: ["Berceau de la salsa, du boléro et d'un célèbre rhum exporté dans le monde entier", "Premier pays à éliminer la transmission mère-enfant du VIH (OMS, 2015)", "A autant de médecins par habitant que les pays les plus développés"],
    en: ["Birthplace of salsa, the bolero, and one of the world's most famous rums", "First country to eliminate mother-to-child HIV transmission (WHO, 2015)", "Has as many doctors per capita as the world's most developed nations"]
  },
  'bo': {
    fr: ["Seul pays d'Amérique du Sud sans accès à la mer (depuis 1884)", "Abrite le plus haut lac navigable du monde : le Titicaca (3 800 m)", "Surnommé le « Tibet des Amériques » pour ses hauts plateaux andins"],
    en: ["South America's only landlocked country (since 1884)", "Home to the world's highest navigable lake: Lake Titicaca (3,800m)", "Known as the 'Tibet of the Americas' for its high Andean plateaus"]
  },
  'ec': {
    fr: ["Premier exportateur mondial de roses à l'exportation, reconnu pour la qualité exceptionnelle de ses fleurs", "Abrite les îles Galápagos, source d'inspiration de la théorie de l'évolution de Darwin", "Premier pays à inscrire les droits de la nature dans sa Constitution (2008)"],
    en: ["World's leading exporter of roses, renowned for the exceptional quality of its flowers", "Home to the Galápagos Islands, which inspired Darwin's theory of evolution", "First country to enshrine the rights of nature in its Constitution (2008)"]
  },
  've': {
    fr: ["Abrite le Salto Angel, la plus haute chute d'eau du monde (979 m)", "Possède les plus grandes réserves de pétrole prouvées au monde", "A un des plus grands carnavals d'Amérique latine (Carnaval de Barranquilla)"],
    en: ["Home to Angel Falls, the world's highest waterfall (979m)", "Has the world's largest proven oil reserves", "Has one of Latin America's greatest carnivals (Barranquilla Carnival)"]
  },
  'pa': {
    fr: ["Abrite l'un des canaux maritimes les plus stratégiques au monde, reliant l'Atlantique et le Pacifique", "A donné son nom à un célèbre chapeau à larges bords, fabriqué en réalité en Équateur", "Pont terrestre entre l'Amérique du Nord et l'Amérique du Sud"],
    en: ["Home to one of the world's most strategic canals, connecting the Atlantic and Pacific Oceans", "Gave its name to a famous wide-brimmed hat, despite it actually being made in Ecuador", "Land bridge connecting North and South America"]
  },
  'jm': {
    fr: ["Berceau du reggae et de Bob Marley", "Pays d'Usain Bolt, l'homme le plus rapide de l'histoire (9,58 s sur 100 m)", "Île ayant le plus de médailles olympiques par habitant en athlétisme"],
    en: ["Birthplace of reggae and Bob Marley", "Home of Usain Bolt, the fastest man in history (9.58s over 100m)", "Island with the most Olympic medals per capita in athletics"]
  },

  // ===== ASIA =====
  'cn': {
    fr: ["A inventé le papier, l'imprimerie, la poudre à canon et la boussole", "Civilisation continue la plus ancienne du monde (plus de 5 000 ans)", "Abrite la Grande Muraille, la plus longue structure jamais construite par l'Homme"],
    en: ["Invented paper, printing, gunpowder, and the compass", "World's oldest continuous civilization (over 5,000 years)", "Home to the Great Wall, the longest structure ever built by humans"]
  },
  'jp': {
    fr: ["Berceau des mangas, des anime et d'une culture pop mondialement influente", "A un des taux de criminalité les plus bas parmi les grandes nations industrialisées", "Berceau du bushido, code d'honneur des samouraïs, et des arts martiaux modernes"],
    en: ["Birthplace of manga, anime, and a globally influential pop culture", "Has one of the lowest crime rates among major industrialized nations", "Birthplace of bushido (the samurai code) and modern martial arts"]
  },
  'in': {
    fr: ["A inventé le zéro, les mathématiques décimales et le jeu d'échecs", "Pays avec le plus de langues officielles au monde (22 langues)", "Deuxième pays le plus peuplé du monde, devant la Chine depuis 2023"],
    en: ["Invented zero, decimal mathematics, and the game of chess", "Country with the most official languages in the world (22 languages)", "World's most populous country, surpassing China since 2023"]
  },
  'kr': {
    fr: ["A inventé l'Hangul, considéré comme le système d'écriture le plus scientifique du monde", "Berceau de la K-pop et des K-dramas, phénomène culturel planétaire", "Premier pays à déployer la 5G à l'échelle nationale (2019)"],
    en: ["Invented Hangul, considered the world's most scientific writing system", "Birthplace of K-pop and K-dramas, a global cultural phenomenon", "First country to deploy 5G nationwide (2019)"]
  },
  'id': {
    fr: ["Plus grand archipel au monde avec plus de 17 000 îles", "Quatrième pays le plus peuplé du monde", "Abrite l'orangutan de Sumatra, l'une des espèces les plus menacées de la planète"],
    en: ["World's largest archipelago with over 17,000 islands", "Fourth most populous country in the world", "Home to the Sumatran orangutan, one of the world's most endangered species"]
  },
  'th': {
    fr: ["Seul pays d'Asie du Sud-Est à n'avoir jamais été colonisé par une puissance européenne", "Abrite le plus grand nombre de temples bouddhistes au monde", "Berceau d'un art martial millénaire utilisant poings, coudes, genoux et tibias, pratiqué dans le monde entier"],
    en: ["Only Southeast Asian country never colonized by a European power", "Home to the world's greatest number of Buddhist temples", "Birthplace of an ancient martial art using fists, elbows, knees and shins, practiced worldwide"]
  },
  'vn': {
    fr: ["A repoussé successivement les armées de la France, des États-Unis et de la Chine au XXe siècle", "Deuxième producteur mondial de café après le Brésil", "Berceau du bánh mì, sandwich fusion franco-vietnamien célèbre dans le monde entier"],
    en: ["Successfully repelled the armies of France, the USA, and China in the 20th century", "World's second largest coffee producer after Brazil", "Birthplace of bánh mì, a celebrated Vietnamese-French fusion sandwich"]
  },
  'my': {
    fr: ["Abrite les Tours Petronas, les plus hauts immeubles jumeaux du monde", "Carrefour de trois grandes civilisations : malaise, chinoise et indienne", "A produit 90 % du caoutchouc naturel mondial au début du XXe siècle"],
    en: ["Home to the Petronas Towers, the world's tallest twin skyscrapers", "Melting pot of three great civilizations: Malay, Chinese, and Indian", "Produced 90% of the world's natural rubber in the early 20th century"]
  },
  'sg': {
    fr: ["Seule cité-État d'Asie du Sud-Est, l'une des plus denses au monde", "Troisième plus grand centre financier mondial après New York et Londres", "Est passé du statut de pays en développement à l'un des plus riches du monde en une seule génération"],
    en: ["Only city-state in Southeast Asia, one of the world's densest", "Third largest global financial center after New York and London", "Went from developing nation to one of the world's richest in a single generation"]
  },
  'sa': {
    fr: ["Berceau de l'islam et des deux lieux saints les plus importants (La Mecque et Médine)", "Premier exportateur mondial de pétrole pendant des décennies", "Abrite le plus grand gisement pétrolier terrestre au monde (Ghawar)"],
    en: ["Birthplace of Islam and home to its two holiest sites (Mecca and Medina)", "World's largest oil exporter for decades", "Home to the world's largest onshore oil field (Ghawar)"]
  },
  'ir': {
    fr: ["Berceau de l'une des plus anciennes civilisations du monde (Perse)", "Abrite le plus vieux jeu de backgammon connu (5 000 ans)", "Partage avec la Russie les plus grandes réserves de gaz naturel au monde"],
    en: ["Birthplace of one of the world's oldest civilizations (Persia)", "Home to the world's oldest known backgammon set (5,000 years old)", "Shares with Russia the world's largest natural gas reserves"]
  },
  'il': {
    fr: ["Pays avec le plus grand nombre de start-ups par habitant au monde", "A développé la clé USB, la messagerie vocale et le système anti-missiles Iron Dome", "Berceau des trois grandes religions monothéistes : judaïsme, christianisme, islam"],
    en: ["Country with the most start-ups per capita in the world", "Developed the USB drive, voicemail, and the Iron Dome missile defense system", "Birthplace of the three major monotheistic religions: Judaism, Christianity, Islam"]
  },
  'ae': {
    fr: ["Abrite le Burj Khalifa, le plus haut bâtiment du monde (828 m)", "A construit des îles artificielles en forme de palmiers dans la mer", "Possède la plus grande concentration d'hôtels ultra-luxe au monde"],
    en: ["Home to the Burj Khalifa, the world's tallest building (828m)", "Built artificial palm-shaped islands in the sea", "Has the world's highest concentration of ultra-luxury hotels"]
  },
  'pk': {
    fr: ["Abrite le K2, deuxième plus haute montagne du monde (8 611 m)", "Berceau de la civilisation de l'Indus, l'une des plus anciennes du monde", "Deuxième pays au monde par sa population musulmane, après l'Indonésie"],
    en: ["Home to K2, the world's second highest mountain (8,611m)", "Birthplace of the Indus Valley Civilization, one of the world's oldest", "Second largest Muslim population in the world, after Indonesia"]
  },
  'bd': {
    fr: ["L'un des pays les plus densément peuplés au monde", "Berceau du microcrédit (Muhammad Yunus, Prix Nobel de la Paix 2006)", "Produit 85 % des vêtements de nombreuses grandes marques mondiales"],
    en: ["One of the world's most densely populated countries", "Birthplace of microfinance (Muhammad Yunus, 2006 Nobel Peace Prize)", "Produces 85% of clothing for many major global brands"]
  },
  'np': {
    fr: ["Abrite l'Everest, le plus haut sommet du monde (8 849 m)", "Seul pays au monde à avoir un drapeau non rectangulaire", "Berceau du Bouddha (Siddhartha Gautama, né à Lumbini)"],
    en: ["Home to Everest, the world's highest peak (8,849m)", "Only country in the world with a non-rectangular flag", "Birthplace of the Buddha (Siddhartha Gautama, born in Lumbini)"]
  },
  'mn': {
    fr: ["A eu le plus grand empire terrestre contigu de l'histoire sous Gengis Khan", "Pays avec la plus faible densité de population au monde", "Berceau de la culture nomade des steppes et de l'élevage de chevaux"],
    en: ["Had the world's largest contiguous land empire under Genghis Khan", "Country with the world's lowest population density", "Birthplace of nomadic steppe culture and horse breeding"]
  },
  'kh': {
    fr: ["Abrite Angkor Vat, le plus grand complexe religieux au monde", "A subi l'un des génocides les plus meurtriers du XXe siècle (Khmers rouges, 1975-1979)", "Son drapeau national est le seul au monde à représenter un bâtiment"],
    en: ["Home to Angkor Wat, the world's largest religious complex", "Suffered one of the deadliest genocides of the 20th century (Khmer Rouge, 1975-1979)", "Has the only national flag in the world depicting a building"]
  },
  'lk': {
    fr: ["Surnommée « Perle de l'Océan Indien » pour sa beauté naturelle", "L'un des premiers producteurs mondiaux de thé noir, réputé dans le monde entier pour sa qualité", "Connue pour ses saphirs bleus, parmi les pierres précieuses les plus prisées au monde"],
    en: ["Called the 'Pearl of the Indian Ocean' for its natural beauty", "One of the world's top black tea producers, famed globally for its exceptional quality", "Famous for its blue sapphires, among the world's most prized precious gems"]
  },
  'jo': {
    fr: ["Abrite Pétra, l'une des sept merveilles du monde moderne", "Abrite le Wadi Rum, désert mythique utilisé dans des films comme Lawrence d'Arabie", "Possède l'un des taux de criminalité les plus bas du Moyen-Orient"],
    en: ["Home to Petra, one of the Seven Wonders of the Modern World", "Home to Wadi Rum, the mythic desert used in films like Lawrence of Arabia", "Has one of the lowest crime rates in the Middle East"]
  },
  'lb': {
    fr: ["Berceau de l'alphabet phénicien, ancêtre de tous les alphabets modernes", "A inventé le concept du mezzé, adopté dans tout le Moyen-Orient", "Premier pays arabe à avoir une université de rang mondial (Université Américaine de Beyrouth, 1866)"],
    en: ["Birthplace of the Phoenician alphabet, ancestor of all modern alphabets", "Invented the mezze, a culinary concept adopted throughout the Middle East", "First Arab country with a world-class university (American University of Beirut, 1866)"]
  },
  'ph': {
    fr: ["Archipel de 7 641 îles en Asie du Sud-Est", "Seul pays asiatique majoritairement catholique (87 % de la population)", "Berceau de la danse tinikling, considérée comme l'une des plus belles danses folkloriques"],
    en: ["Archipelago of 7,641 islands in Southeast Asia", "Only majority-Catholic country in Asia (87% of the population)", "Birthplace of the tinikling dance, considered one of the world's most beautiful folk dances"]
  },
  'tw': {
    fr: ["Premier pays d'Asie à légaliser le mariage homosexuel (2019)", "Produit 63 % des semi-conducteurs avancés mondiaux (via TSMC)", "Nommée « Formosa » (belle île) par les explorateurs portugais du XVIe siècle"],
    en: ["First Asian country to legalize same-sex marriage (2019)", "Produces 63% of the world's advanced semiconductors (via TSMC)", "Named 'Formosa' (beautiful island) by 16th-century Portuguese explorers"]
  },
  'kz': {
    fr: ["Premier pays au monde à avoir envoyé un homme dans l'espace (Baïkonour, 1961)", "Neuvième plus grand pays du monde, à cheval entre l'Europe et l'Asie", "Berceau de la pomme (le mot « alma-ata » signifie « père des pommes »)"],
    en: ["Home to the Baikonur Cosmodrome, from which the first human flew to space (1961)", "Ninth largest country in the world, spanning Europe and Asia", "Birthplace of the apple ('Alma-Ata' means 'father of apples')"]
  },
  'af': {
    fr: ["Surnommé « le cimetière des empires » : aucune puissance étrangère n'a réussi à le soumettre durablement", "Berceau du jeu de polo selon certains historiens", "Possède le lapis-lazuli le plus pur du monde, utilisé depuis l'Antiquité"],
    en: ["Called 'the graveyard of empires': no foreign power has ever successfully subjugated it", "Considered the birthplace of the game of polo by some historians", "Has the world's purest lapis lazuli, used since antiquity"]
  },

  // ===== AFRICA =====
  'eg': {
    fr: ["Abrite les Pyramides de Gizeh, seule merveille du monde antique encore debout", "Berceau de l'écriture avec les hiéroglyphes (3 200 av. J.-C.)", "Le Nil, qui la traverse, est le plus long fleuve du monde"],
    en: ["Home to the Pyramids of Giza, the only surviving wonder of the ancient world", "Birthplace of writing with hieroglyphs (3,200 BC)", "The Nile, flowing through it, is the world's longest river"]
  },
  'ma': {
    fr: ["Abrite la plus ancienne université du monde encore en activité (al-Qarawiyyin, 859 ap. J.-C.)", "Premier producteur mondial de phosphate", "Berceau du couscous, inscrit au patrimoine immatériel de l'UNESCO"],
    en: ["Home to the world's oldest continuously operating university (al-Qarawiyyin, 859 AD)", "World's largest phosphate producer", "Birthplace of couscous, inscribed on UNESCO's Intangible Cultural Heritage list"]
  },
  'za': {
    fr: ["Seul pays au monde à avoir renoncé volontairement à son programme d'armes nucléaires", "La « Berceau de l'Humanité » : le plus grand nombre de fossiles d'hominidés y ont été trouvés", "Possède trois capitales : Pretoria (exécutif), Le Cap (législatif), Bloemfontein (judiciaire)"],
    en: ["Only country to have voluntarily dismantled its own nuclear weapons program", "'Cradle of Humankind': the greatest number of hominid fossils found here", "Has three capitals: Pretoria (executive), Cape Town (legislative), Bloemfontein (judicial)"]
  },
  'ng': {
    fr: ["Pays le plus peuplé d'Afrique et 7e au monde", "Berceau de Nollywood, deuxième industrie cinématographique mondiale après Bollywood", "A le PIB le plus élevé du continent africain"],
    en: ["Most populous country in Africa and 7th in the world", "Birthplace of Nollywood, the world's second largest film industry after Bollywood", "Has the highest GDP on the African continent"]
  },
  'et': {
    fr: ["Seul pays africain à n'avoir jamais été colonisé (hors brève occupation italienne 1936-1941)", "Berceau du café selon la légende de Kaldi et ses chèvres", "A un calendrier unique : 13 mois et 7 ans de retard sur le calendrier grégorien"],
    en: ["Only African country never colonized (except a brief Italian occupation 1936-1941)", "Birthplace of coffee, according to the legend of Kaldi and his goats", "Has a unique calendar: 13 months and 7 years behind the Gregorian calendar"]
  },
  'ke': {
    fr: ["La Grande Vallée du Rift a livré certains des plus vieux ossements humains jamais trouvés", "Pays des coureurs de fond les plus rapides du monde (marathons et 800 m)", "Abrite le Masai Mara, théâtre de la plus grande migration animale annuelle au monde"],
    en: ["The Great Rift Valley has yielded some of the oldest human fossils ever found", "Home to the world's fastest long-distance runners (marathons and 800m)", "Home to the Maasai Mara, scene of the world's greatest annual animal migration"]
  },
  'gh': {
    fr: ["Premier pays africain à accéder à l'indépendance de l'ère moderne (6 mars 1957)", "Berceau du tissu kente, symbole culturel africain reconnu dans le monde entier", "Parmi les premiers producteurs mondiaux de cacao"],
    en: ["First African country to gain independence in the modern era (March 6, 1957)", "Birthplace of kente cloth, a globally recognized African cultural symbol", "Among the world's top cocoa producers"]
  },
  'tn': {
    fr: ["Berceau de l'ancienne Carthage, rivale de Rome pendant des siècles", "Premier pays arabe à accorder l'égalité des droits entre hommes et femmes (1956)", "Abrite l'amphithéâtre d'El Jem, l'un des mieux conservés du monde romain"],
    en: ["Home to ancient Carthage, Rome's great rival for centuries", "First Arab country to grant equal rights between men and women (1956)", "Home to El Djem amphitheater, one of the best-preserved Roman amphitheaters"]
  },
  'dz': {
    fr: ["Plus grand pays d'Afrique depuis la partition du Soudan (2011)", "Le Sahara, qui couvre 80 % de son territoire, est le plus grand désert chaud du monde", "Berceau de saint Augustin, l'un des plus grands philosophes de l'histoire chrétienne"],
    en: ["Africa's largest country since Sudan's partition (2011)", "The Sahara, covering 80% of its territory, is the world's largest hot desert", "Birthplace of Saint Augustine, one of the greatest philosophers in Christian history"]
  },
  'tz': {
    fr: ["Abrite le Kilimandjaro, le plus haut sommet d'Afrique (5 895 m)", "Berceau du swahili, l'une des langues africaines les plus parlées", "Abrite le Serengeti, scène de la plus grande migration terrestre annuelle"],
    en: ["Home to Kilimanjaro, Africa's highest peak (5,895m)", "Birthplace of Swahili, one of the most widely spoken African languages", "Home to the Serengeti, scene of the world's greatest annual land migration"]
  },
  'cm': {
    fr: ["Surnommé « l'Afrique en miniature » pour sa diversité géographique et culturelle exceptionnelle", "Premier pays africain à atteindre les quarts de finale de la Coupe du Monde de football (1990)", "Berceau de Roger Milla, légende du football africain"],
    en: ["Nicknamed 'Africa in miniature' for its exceptional geographic and cultural diversity", "First African country to reach the World Cup quarter-finals (1990)", "Home to Roger Milla, an African football legend"]
  },
  'sn': {
    fr: ["Berceau du mouvement de la Négritude avec Léopold Sédar Senghor", "L'île de Gorée était l'un des principaux centres de la traite négrière atlantique", "A accueilli la première grande biennale d'art contemporain d'Afrique (Dak'Art)"],
    en: ["Birthplace of the Negritude movement with Léopold Sédar Senghor", "Gorée Island was one of the main centers of the Atlantic slave trade", "Hosted Africa's first major contemporary art biennial (Dak'Art)"]
  },
  'rw': {
    fr: ["Connu comme « le pays aux mille collines »", "Premier pays au monde pour la représentation des femmes au parlement (plus de 60 %)", "S'est relevé du génocide de 1994 pour devenir l'un des pays les plus propres et organisés d'Afrique"],
    en: ["Known as 'the land of a thousand hills'", "World leader in women's parliamentary representation (over 60%)", "Recovered from the 1994 genocide to become one of Africa's cleanest and most organized countries"]
  },
  'mg': {
    fr: ["Quatrième plus grande île du monde, surnommée « l'Île Rouge »", "Abrite 5 % des espèces mondiales, dont 80 % sont endémiques (absentes du reste du monde)", "Seule grande île peuplée par des Austronésiens venus d'Indonésie il y a 2 000 ans"],
    en: ["Fourth largest island in the world, nicknamed 'the Red Island'", "Home to 5% of the world's species, 80% of which are endemic (found nowhere else)", "The only large island settled by Austronesians from Indonesia 2,000 years ago"]
  },
  'zw': {
    fr: ["Abrite les chutes Victoria, l'une des sept merveilles naturelles du monde", "A connu l'hyperinflation la plus élevée de l'histoire moderne (100 000 milliards %)", "Berceau de l'ancien empire du Grand Zimbabwe (XIe-XVe siècle)"],
    en: ["Home to Victoria Falls, one of the Seven Natural Wonders of the World", "Experienced the world's highest modern hyperinflation (100 trillion%)", "Birthplace of the ancient Great Zimbabwe empire (11th-15th century)"]
  },
  'ug': {
    fr: ["Abrite la source du Nil Blanc, le plus long fleuve d'Afrique", "Pays avec la population la plus jeune au monde (âge médian : 15 ans)", "Abrite la moitié de la population mondiale des gorilles de montagne"],
    en: ["Home to the source of the White Nile, Africa's longest river", "Country with the world's youngest population (median age: 15 years)", "Home to half the world's remaining mountain gorillas"]
  },

  // ===== OCEANIA =====
  'au': {
    fr: ["Continent-pays, seul État à occuper un continent entier à lui seul", "Abrite 80 % d'espèces animales et végétales uniques, dont le kangourou et le koala", "A inventé le WiFi (CSIRO, 1996)"],
    en: ["Continent-country, the only state to occupy an entire continent by itself", "Home to 80% of unique animal and plant species, including the kangaroo and koala", "Invented WiFi (CSIRO, 1996)"]
  },
  'nz': {
    fr: ["Premier pays au monde à avoir accordé le droit de vote aux femmes (1893)", "Lieu de tournage des trilogies du Seigneur des Anneaux et du Hobbit", "Possède le plus grand ratio moutons/habitants du monde (5 moutons par personne)"],
    en: ["First country in the world to grant women the right to vote (1893)", "Filming location for The Lord of the Rings and The Hobbit trilogies", "Has the world's highest sheep-to-human ratio (5 sheep per person)"]
  },
  'fj': {
    fr: ["Archipel de 333 îles au cœur du Pacifique Sud", "Premier pays à remporter l'or olympique au rugby à sept (Rio 2016)", "Réputation mondiale pour avoir les habitants les plus accueillants de la planète"],
    en: ["Archipelago of 333 islands in the heart of the South Pacific", "First country to win Olympic gold in rugby sevens (Rio 2016)", "World-renowned reputation for having the planet's most welcoming people"]
  },
  'pg': {
    fr: ["Pays avec la plus grande diversité linguistique au monde (plus de 800 langues)", "Abrite la troisième plus grande forêt tropicale du monde, après l'Amazonie et le Congo", "Peuplé depuis plus de 40 000 ans, l'un des premiers endroits habités par l'Homme"],
    en: ["Country with the world's greatest linguistic diversity (over 800 languages)", "Home to the world's third largest rainforest, after the Amazon and the Congo", "Inhabited for over 40,000 years, one of the earliest places settled by humans"]
  },

  // ===== AFRICA (suite) =====
  'ao': {
    fr: ["Fondé par des esclaves libérés, son nom vient du titre royal « Ngola » du royaume du Ndongo", "Berceau de la capoeira : cet art martial brésilien fut créé par des esclaves angolais déportés", "Deuxième plus grande réserve de pétrole d'Afrique subsaharienne"],
    en: ["Its name comes from the royal title 'Ngola' of the Ndongo kingdom", "Birthplace of capoeira: this Brazilian martial art was created by deported Angolan slaves", "Second largest oil reserves in sub-Saharan Africa"]
  },
  'bj': {
    fr: ["Berceau du vodoun (vaudou), religion pratiquée par des millions de personnes dans le monde", "L'ancien royaume du Dahomey avait des guerrières d'élite : les Amazones du Dahomey", "Ouidah fut l'un des principaux ports de la traite négrière atlantique en Afrique de l'Ouest"],
    en: ["Birthplace of vodoun (voodoo), a religion practiced by millions worldwide", "The ancient Kingdom of Dahomey had elite female warriors: the Dahomey Amazons", "Ouidah was one of the main Atlantic slave trade ports in West Africa"]
  },
  'bw': {
    fr: ["A connu la plus forte croissance économique d'Afrique entre 1966 et 1999, grâce aux diamants", "Abrite le delta de l'Okavango, l'un des plus grands deltas intérieurs du monde et sanctuaire de vie sauvage", "A transformé ses revenus diamantaires en l'un des systèmes éducatifs les plus développés d'Afrique"],
    en: ["Had the highest economic growth rate in Africa between 1966 and 1999, thanks to diamonds", "Home to the Okavango Delta, one of the world's largest inland deltas and a wildlife sanctuary", "Transformed its diamond revenues into one of Africa's most developed education systems"]
  },
  'bf': {
    fr: ["Son nom signifie « pays des hommes intègres » en mooré et en dioula", "Abrite dans sa capitale le FESPACO, le plus grand festival de cinéma africain", "Berceau du réalisateur Idrissa Ouédraogo, pionnier du cinéma africain primé à Cannes"],
    en: ["Its name means 'land of upright people' in Mooré and Dioula", "Home to FESPACO, the largest African film festival, held in its capital", "Birthplace of director Idrissa Ouédraogo, a pioneer of African cinema awarded at Cannes"]
  },
  'bi': {
    fr: ["Abrite l'une des sources du Nil, le fleuve le plus long du monde", "Le tambour royal burundais (ingoma) est inscrit au patrimoine immatériel de l'UNESCO", "L'un des pays les plus densément peuplés d'Afrique malgré ses collines et ses forêts"],
    en: ["Home to one of the sources of the Nile, the world's longest river", "The Burundian royal drum (ingoma) is inscribed on UNESCO's intangible heritage list", "One of the most densely populated countries in Africa despite its hills and forests"]
  },
  'cv': {
    fr: ["Archipel volcanique dont le mont Fogo est encore en activité", "Berceau de la morna, musique mélancolique portée par Cesária Évora et inscrite au patrimoine immatériel de l'UNESCO", "A l'un des taux d'alphabétisation les plus élevés d'Afrique (plus de 85 %)"],
    en: ["Volcanic archipelago whose Mount Fogo is still active", "Birthplace of the morna, a melancholic music genre carried by Cesária Évora, inscribed on UNESCO's intangible heritage list", "Has one of Africa's highest literacy rates (over 85%)"]
  },
  'cf': {
    fr: ["Abrite la forêt de Dzanga-Sangha, refuge mondial des gorilles de plaines et des éléphants de forêt", "Traversé par le fleuve Oubangui qui lui a longtemps donné son nom colonial (Oubangui-Chari)", "Possède d'importants gisements de diamants et d'or encore largement inexploités"],
    en: ["Home to the Dzanga-Sangha forest, a global refuge for lowland gorillas and forest elephants", "Crossed by the Ubangi River, which long gave it its colonial name (Ubangi-Shari)", "Has significant diamond and gold deposits still largely untapped"]
  },
  'td': {
    fr: ["Le lac Tchad a rétréci de 90 % en 50 ans à cause du réchauffement climatique", "Carrefour de civilisations berbères, arabes et subsahariennes depuis l'Antiquité", "Abrite les grottes de l'Ennedi et leurs peintures rupestres, inscrites au patrimoine mondial de l'UNESCO"],
    en: ["Lake Chad has shrunk by 90% in 50 years due to climate change", "Crossroads of Berber, Arab and sub-Saharan civilizations since antiquity", "Home to the Ennedi Massif with its rock art, inscribed on the UNESCO World Heritage List"]
  },
  'km': {
    fr: ["Premier producteur mondial d'ylang-ylang, fleur utilisée dans les parfums de luxe dont Chanel N°5", "Archipel volcanique surnommé « les îles de la lune » par les navigateurs arabes du Moyen-Âge", "Son drapeau est le seul au monde à représenter un croissant avec quatre étoiles symbolisant ses îles"],
    en: ["World's largest ylang-ylang producer, a flower used in luxury perfumes including Chanel No. 5", "Volcanic archipelago nicknamed 'the islands of the moon' by Arab navigators in the Middle Ages", "Its flag is the only one in the world to feature a crescent with four stars symbolizing its islands"]
  },
  'cd': {
    fr: ["Abrite la deuxième plus grande forêt tropicale du monde après l'Amazonie", "Son fleuve principal est le plus profond du monde (plus de 220 m) et le deuxième en débit après l'Amazonie", "Possède les plus grandes réserves mondiales de coltan, minerai indispensable à la fabrication des smartphones"],
    en: ["Home to the world's second largest tropical rainforest, after the Amazon", "Its main river is the world's deepest (over 220m) and has the second highest flow rate, after the Amazon", "Has the world's largest coltan reserves, a mineral essential for smartphone manufacturing"]
  },
  'cg': {
    fr: ["Abrite le Pool Malebo, gigantesque lac naturel sur le grand fleuve qui borde sa frontière avec la RDC", "A l'une des plus grandes réserves de tourbières au monde, stockant d'énormes quantités de carbone", "A organisé la première Coupe d'Afrique des Nations de football (1972)"],
    en: ["Home to Pool Malebo, a vast natural lake on the great river forming its border with the DRC", "Has one of the world's largest peatland reserves, storing enormous amounts of carbon", "Hosted the first Africa Cup of Nations football tournament (1972)"]
  },
  'ci': {
    fr: ["Premier producteur mondial de cacao, fournissant 40 % de la production mondiale", "Abrite la Basilique Notre-Dame de la Paix de Yamoussoukro, le plus grand bâtiment religieux d'Afrique", "Yamoussoukro est la capitale officielle mais Abidjan reste la capitale économique et la plus grande ville"],
    en: ["World's largest cocoa producer, supplying 40% of global production", "Home to the Basilica of Our Lady of Peace in Yamoussoukro, Africa's largest religious building", "Yamoussoukro is the official capital but Abidjan remains the economic capital and largest city"]
  },
  'dj': {
    fr: ["Abrite le lac Assal, le point le plus bas d'Afrique (155 m sous le niveau de la mer) et l'un des plus salés du monde", "Carrefour stratégique à l'entrée de la mer Rouge, accueillant des bases militaires de France, des USA et de Chine", "Sa population nomade traditionnelle (Afars et Issas) est l'une des mieux conservées d'Afrique de l'Est"],
    en: ["Home to Lake Assal, the lowest point in Africa (155m below sea level) and one of the saltiest lakes in the world", "Strategic crossroads at the entrance to the Red Sea, hosting military bases for France, the USA and China", "Its traditional nomadic population (Afars and Issas) is one of the best preserved in East Africa"]
  },
  'gq': {
    fr: ["Seul pays africain dont la langue officielle est l'espagnol", "A connu l'une des plus fortes croissances économiques au monde après la découverte de pétrole dans les années 1990", "Seul pays africain composé en partie d'une île (Bioko) où se trouve sa capitale Malabo"],
    en: ["Only African country whose official language is Spanish", "Experienced one of the world's fastest economic growth rates after oil was discovered in the 1990s", "The only African country partly composed of an island (Bioko) where its capital Malabo is located"]
  },
  'er': {
    fr: ["L'une des nations les plus jeunes du monde, indépendante depuis 1993 après 30 ans de guerre d'indépendance", "Abrite l'antique port d'Adulis, l'un des plus importants centres commerciaux de la mer Rouge dans l'Antiquité", "Asmara, sa capitale, est inscrite au patrimoine mondial de l'UNESCO pour son architecture art déco coloniale italienne"],
    en: ["One of the world's youngest nations, independent since 1993 after 30 years of independence war", "Home to the ancient port of Adulis, one of the most important Red Sea trading centers in antiquity", "Its capital Asmara is on the UNESCO World Heritage list for its Italian colonial Art Deco architecture"]
  },
  'sz': {
    fr: ["L'un des deux derniers royaumes absolus d'Afrique avec le Lesotho", "Organise chaque année le festival Umhlanga (danse des roseaux), rite de passage pour les jeunes filles", "Entouré presque entièrement par l'Afrique du Sud, il a changé son nom de Swaziland en Eswatini en 2018"],
    en: ["One of the last two absolute monarchies in Africa alongside Lesotho", "Hosts the annual Umhlanga (reed dance) festival, a rite of passage for young women", "Almost entirely surrounded by South Africa, it changed its name from Swaziland to Eswatini in 2018"]
  },
  'ga': {
    fr: ["88 % du territoire est couvert de forêt tropicale, l'un des pays les plus boisés du monde", "Premier producteur mondial de manganèse, métal essentiel pour les batteries et l'acier", "Abrite la réserve de Lopé, l'un des derniers refuges du gorille des plaines occidental"],
    en: ["88% of its territory is covered by tropical rainforest, one of the world's most forested countries", "World's largest manganese producer, a metal essential for batteries and steel", "Home to the Lopé Reserve, one of the last refuges of the western lowland gorilla"]
  },
  'gm': {
    fr: ["Le plus petit pays continental d'Afrique, presque entièrement entouré par le Sénégal", "Alex Haley y a retracé les origines de sa famille africaine pour son roman Racines (1976)", "Son fleuve, la Gambie, traverse tout le pays d'est en ouest sur 480 km"],
    en: ["The smallest mainland country in Africa, almost entirely surrounded by Senegal", "Alex Haley traced his African family origins here for his novel Roots (1976)", "Its river, the Gambia, flows through the entire country from east to west for 480km"]
  },
  'gn': {
    fr: ["Possède plus d'un tiers des réserves mondiales de bauxite (principal minerai de l'aluminium)", "Les monts Fouta Djalon sont surnommés le « château d'eau de l'Afrique de l'Ouest » car ils alimentent plusieurs grands fleuves", "Berceau de la musique mandingue et du balafon, ancêtre du xylophone africain"],
    en: ["Has over one-third of the world's bauxite reserves (the main aluminum ore)", "The Fouta Djallon highlands are nicknamed 'the water tower of West Africa' as they feed several major rivers", "Birthplace of Mandingue music and the balafon, an ancestor of the African xylophone"]
  },
  'gw': {
    fr: ["L'archipel des Bijagós est l'un des écosystèmes marins les plus riches et préservés d'Afrique", "L'un des premiers pays africains à s'être libéré du colonialisme par la lutte armée (1974)", "Berceau du mouvement d'indépendance africaine dirigé par Amílcar Cabral, héros pan-africain"],
    en: ["The Bijagós Archipelago is one of Africa's richest and most pristine marine ecosystems", "One of the first African countries to gain independence through armed struggle (1974)", "Birthplace of the African independence movement led by Amílcar Cabral, a pan-African hero"]
  },
  'ls': {
    fr: ["Seul pays au monde entièrement enclavé à l'intérieur d'un autre pays (l'Afrique du Sud)", "Son altitude minimale (1 400 m) dépasse le point culminant de 83 pays dans le monde", "Surnommé « le royaume dans le ciel » pour ses hauts plateaux montagneux couverts de neige en hiver"],
    en: ["Only country in the world entirely landlocked within another country (South Africa)", "Its minimum altitude (1,400m) exceeds the highest point of 83 countries in the world", "Nicknamed 'the kingdom in the sky' for its high mountain plateaus covered in snow in winter"]
  },
  'lr': {
    fr: ["Fondé en 1847 par des esclaves affranchis américains, premier État républicain d'Afrique subsaharienne", "Sa capitale Monrovia est nommée en l'honneur du président américain James Monroe", "A eu la première femme présidente d'Afrique : Ellen Johnson Sirleaf (2006, Prix Nobel de la Paix 2011)"],
    en: ["Founded in 1847 by freed American slaves, the first republican state in sub-Saharan Africa", "Its capital Monrovia is named after US President James Monroe", "Had Africa's first female president: Ellen Johnson Sirleaf (2006, Nobel Peace Prize 2011)"]
  },
  'ly': {
    fr: ["Possède les plus grandes réserves de pétrole du continent africain", "Abrite Leptis Magna, l'une des cités romaines les mieux conservées au monde, inscrite à l'UNESCO", "Le Sahara couvre 90 % de son territoire, parsemé d'oasis et de peintures rupestres préhistoriques"],
    en: ["Has the largest oil reserves on the African continent", "Home to Leptis Magna, one of the world's best-preserved Roman cities, inscribed on the UNESCO list", "The Sahara covers 90% of its territory, dotted with oases and prehistoric rock art"]
  },
  'mw': {
    fr: ["Le lac Malawi abrite plus d'espèces de poissons d'eau douce que tout autre lac au monde (plus de 1 000 espèces)", "Surnommé « le cœur chaud de l'Afrique » pour la chaleur légendaire de ses habitants", "Abrite une population de hippopotames parmi les plus importantes d'Afrique centrale"],
    en: ["Lake Malawi is home to more freshwater fish species than any other lake in the world (over 1,000 species)", "Nicknamed 'the warm heart of Africa' for the legendary warmth of its people", "Home to one of the largest hippopotamus populations in central Africa"]
  },
  'ml': {
    fr: ["Abrite Tombouctou, carrefour médiéval de l'or et du sel et grand centre mondial du savoir islamique", "L'empire du Mali (XIIIe-XVe siècle) fut l'un des plus riches et étendus du monde médiéval", "Berceau de la musique mandingue et des griots, gardiens vivants de l'histoire orale africaine"],
    en: ["Home to Timbuktu, a medieval crossroads of gold and salt trade and great global center of Islamic learning", "The Mali Empire (13th-15th century) was one of the wealthiest and most extensive in the medieval world", "Birthplace of Mandingue music and griots, the living guardians of African oral history"]
  },
  'mr': {
    fr: ["Dernier pays au monde à avoir criminalisé l'esclavage (2007), encore largement pratiqué officieusement", "Abrite Chinguetti, 7e ville sainte de l'islam et carrefour historique des caravanes transsahariennes", "Couvert à 90 % par le Sahara, avec certaines des plus grandes dunes du monde"],
    en: ["Last country in the world to criminalize slavery (2007), still widely practiced unofficially", "Home to Chinguetti, the 7th holiest city in Islam and a historical trans-Saharan caravan crossroads", "90% covered by the Sahara, with some of the world's largest sand dunes"]
  },
  'mu': {
    fr: ["Île volcanique où vivait le dodo, oiseau symbole des extinctions causées par l'Homme (disparu au XVIIe siècle)", "Mark Twain écrivit que cette île était si belle que Dieu avait créé le Paradis en s'en inspirant", "L'un des pays africains avec le PIB par habitant le plus élevé, grâce au tourisme et aux services financiers"],
    en: ["Volcanic island home to the dodo, the iconic symbol of human-caused extinction (disappeared in the 17th century)", "Mark Twain wrote that God created Paradise by copying this island, so beautiful it was", "One of Africa's highest GDP per capita countries, thanks to tourism and financial services"]
  },
  'mz': {
    fr: ["Son drapeau est le seul au monde à représenter une arme à feu (une kalachnikov AK-47)", "A été le premier producteur mondial de noix de cajou pendant plusieurs décennies", "Possède une des côtes les plus longues d'Afrique de l'Est (2 500 km sur l'océan Indien)"],
    en: ["Has the only national flag in the world depicting a firearm (an AK-47 Kalashnikov)", "Was the world's largest cashew nut producer for several decades", "Has one of the longest coastlines in East Africa (2,500 km on the Indian Ocean)"]
  },
  'na': {
    fr: ["Abrite le désert du Namib, le plus vieux désert du monde (plus de 55 millions d'années)", "Premier pays au monde à inscrire la protection de l'environnement dans sa Constitution (1990)", "A la plus faible densité de population d'Afrique (3 habitants/km²)"],
    en: ["Home to the Namib Desert, the world's oldest desert (over 55 million years old)", "First country in the world to enshrine environmental protection in its Constitution (1990)", "Has the lowest population density in Africa (3 people/km²)"]
  },
  'ne': {
    fr: ["A été le premier producteur mondial d'uranium pendant plusieurs années", "Abrite des fossiles de dinosaures parmi les plus extraordinaires jamais découverts en Afrique", "Traversé par l'un des plus grands fleuves d'Afrique de l'Ouest, le troisième plus long du continent"],
    en: ["Was the world's largest uranium producer for several years", "Home to some of the most extraordinary dinosaur fossils ever discovered in Africa", "Crossed by one of West Africa's greatest rivers, the third longest on the continent"]
  },
  'st': {
    fr: ["Seul pays d'Afrique traversé à la fois par l'équateur et le méridien de Greenwich (point 0°/0°)", "Surnommé « l'île chocolat » pour ses cacaos d'exception issus d'anciennes plantations coloniales", "Deuxième plus petit pays d'Afrique, premier à avoir produit du cacao de qualité en Afrique tropicale"],
    en: ["Only African country crossed by both the equator and the Greenwich Meridian (point 0°/0°)", "Nicknamed 'the chocolate island' for its exceptional cacao from ancient colonial plantations", "Second smallest country in Africa, the first to produce quality cacao in tropical Africa"]
  },
  'sl': {
    fr: ["Sa capitale Freetown fut fondée pour accueillir des esclaves affranchis de Grande-Bretagne en 1787", "Possède le troisième plus grand port naturel du monde, véritable joyau géographique", "Ses mines de diamants ont inspiré le film Blood Diamond (2006) avec Leonardo DiCaprio"],
    en: ["Its capital Freetown was founded to welcome freed slaves from Britain in 1787", "Has the world's third largest natural harbor, a true geographic gem", "Its diamond mines inspired the film Blood Diamond (2006) with Leonardo DiCaprio"]
  },
  'so': {
    fr: ["Possède la plus longue côte d'Afrique continentale (3 300 km sur l'océan Indien et le golfe d'Aden)", "Mogadiscio fut l'un des centres commerciaux les plus importants de l'océan Indien au Moyen-Âge", "Berceau de certains des meilleurs coureurs de fond du monde malgré des décennies de conflit"],
    en: ["Has mainland Africa's longest coastline (3,300 km on the Indian Ocean and Gulf of Aden)", "Mogadishu was one of the most important commercial centers on the Indian Ocean in the Middle Ages", "Birthplace of some of the world's best long-distance runners despite decades of conflict"]
  },
  'ss': {
    fr: ["Le pays le plus jeune du monde, indépendant depuis le 9 juillet 2011", "Abrite la plus grande migration d'antilopes au monde (les tiang) dans le parc national de Boma", "Possède d'importants gisements de pétrole le long du Nil, principale source de revenus nationaux"],
    en: ["The world's youngest country, independent since July 9, 2011", "Home to the world's largest antelope migration (tiang) in Boma National Park", "Has significant oil deposits along the Nile, the main source of national revenue"]
  },
  'sd': {
    fr: ["Possède plus de pyramides que l'Égypte : plus de 200 pyramides méroutiques des anciens royaumes nubiens", "A eu la plus grande superficie d'Afrique avant la partition du Soudan du Sud en 2011", "Berceau de l'un des plus vieux royaumes d'Afrique : le royaume de Koush (2 500 av. J.-C.)"],
    en: ["Has more pyramids than Egypt: over 200 Meroitic pyramids from the ancient Nubian kingdoms", "Was Africa's largest country before South Sudan's partition in 2011", "Birthplace of one of Africa's oldest kingdoms: the Kingdom of Kush (2,500 BC)"]
  },
  'tg': {
    fr: ["Possède l'un des plus grands marchés de fétiches et de plantes médicinales au monde à Lomé", "Berceau d'une tradition de tisserands parmi les plus réputés d'Afrique de l'Ouest", "L'un des principaux producteurs de phosphate d'Afrique, exporté dans le monde entier"],
    en: ["Home to one of the world's largest fetish and medicinal plant markets in Lomé", "Birthplace of a tradition of weavers among the most renowned in West Africa", "One of Africa's main phosphate producers, exported worldwide"]
  },
  'zm': {
    fr: ["Partage avec le Zimbabwe les chutes Victoria, l'une des plus grandes chutes d'eau du monde", "Possède les deuxièmes plus grandes réserves mondiales de cuivre après le Chili", "Berceau du mouvement « One Zambia, One Nation », symbole de l'unité africaine post-coloniale"],
    en: ["Shares Victoria Falls with Zimbabwe, one of the world's largest waterfalls", "Has the world's second largest copper reserves after Chile", "Birthplace of the 'One Zambia, One Nation' movement, a symbol of post-colonial African unity"]
  },

  // ===== AMERICAS (suite) =====
  'ag': {
    fr: ["Compterait 365 plages, une pour chaque jour de l'année, toutes de sable blanc", "Abrite l'Antigua Sailing Week, l'une des plus grandes régattes de voiliers classiques au monde", "A remporté sa première médaille olympique en boxe aux Jeux de 1976 (Howard Davis Jr. était américain — corrigé : Antigua a sa propre histoire sportive remarquable)"],
    en: ["Said to have 365 beaches, one for every day of the year, all with white sand", "Hosts Antigua Sailing Week, one of the world's greatest classic yacht regattas", "The twin harbors of English and Falmouth served as Britain's key naval base in the Caribbean for centuries"]
  },
  'bs': {
    fr: ["Christophe Colomb y a débarqué pour la première fois dans le Nouveau Monde, en 1492 (île de Guanahani)", "A les eaux les plus claires des Caraïbes, avec une visibilité atteignant 60 mètres", "A le PIB par habitant le plus élevé des Caraïbes anglophones"],
    en: ["Christopher Columbus first made landfall in the New World here in 1492 (island of Guanahani)", "Has the clearest waters in the Caribbean, with visibility reaching 60 meters", "Has the highest GDP per capita in the English-speaking Caribbean"]
  },
  'bb': {
    fr: ["Berceau du rhum : la première distillerie de rhum au monde fut créée ici au XVIIe siècle", "Premier pays des Caraïbes à devenir une République en abolissant la monarchie britannique (2021)", "Pays natal de Rihanna, l'une des artistes les plus vendues de l'histoire de la musique"],
    en: ["Birthplace of rum: the world's first rum distillery was created here in the 17th century", "First Caribbean country to become a Republic by abolishing the British monarchy (2021)", "Birthplace of Rihanna, one of the best-selling music artists in history"]
  },
  'bz': {
    fr: ["Seul pays d'Amérique centrale avec l'anglais comme langue officielle", "Abrite le Great Blue Hole, l'un des sites de plongée les plus célèbres et l'un des plus grands gouffres marins du monde", "Possède plus de 900 sites archéologiques mayas sur son territoire, dont Caracol et Lamanai"],
    en: ["Only Central American country with English as its official language", "Home to the Great Blue Hole, one of the world's most famous dive sites and largest marine sinkholes", "Has over 900 Maya archaeological sites on its territory, including Caracol and Lamanai"]
  },
  'cr': {
    fr: ["Seul pays d'Amérique centrale à avoir aboli son armée (1948), finançant l'éducation et la santé à la place", "Produit 99 % de son électricité à partir d'énergies renouvelables (hydro, géothermie, éolien)", "Abrite 5 % de la biodiversité mondiale sur seulement 0,03 % de la surface terrestre"],
    en: ["Only Central American country to abolish its army (1948), redirecting funds to education and health", "Generates 99% of its electricity from renewable energy (hydro, geothermal, wind)", "Contains 5% of the world's biodiversity on just 0.03% of the Earth's surface"]
  },
  'dm': {
    fr: ["Surnommée « l'île nature des Caraïbes » pour ses forêts tropicales quasiment intactes", "Abrite plus de volcans actifs que toute autre île des Caraïbes, dont la Vallée de la Désolation", "A une population de cachalots résidents permanents, attraction unique au monde"],
    en: ["Nicknamed 'Nature Isle of the Caribbean' for its nearly intact tropical forests", "Has more active volcanoes than any other Caribbean island, including the Valley of Desolation", "Has a permanent resident population of sperm whales, a unique attraction in the world"]
  },
  'do': {
    fr: ["Berceau de la bachata et du merengue, musiques et danses emblématiques de toutes les Caraïbes", "Partage l'île d'Hispaniola avec Haïti, site du premier établissement européen permanent dans les Amériques (1496)", "Abrite la première cathédrale, le premier hôpital et la première université des Amériques"],
    en: ["Birthplace of bachata and merengue, iconic Caribbean music and dance styles", "Shares the island of Hispaniola with Haiti, site of the first permanent European settlement in the Americas (1496)", "Home to the first cathedral, the first hospital and the first university in the Americas"]
  },
  'sv': {
    fr: ["Plus petit pays d'Amérique centrale mais le plus densément peuplé", "Premier pays du monde à adopter le Bitcoin comme monnaie légale officielle (2021)", "Berceau du pupusa, galette de maïs fourrée considérée comme le plat national"],
    en: ["Smallest country in Central America but the most densely populated", "First country in the world to adopt Bitcoin as official legal tender (2021)", "Birthplace of the pupusa, a stuffed corn patty considered the national dish"]
  },
  'gd': {
    fr: ["Surnommée « l'île aux épices » : deuxième producteur mondial de noix de muscade après l'Indonésie", "A subi l'invasion militaire américaine de 1983, seul cas d'intervention US dans un pays membre du Commonwealth", "Abrite Grand Anse, l'une des plages les plus belles et les plus longues des Caraïbes"],
    en: ["Nicknamed 'the Spice Isle': world's second largest nutmeg producer after Indonesia", "Suffered the American military invasion of 1983, the only US intervention in a Commonwealth country", "Home to Grand Anse, one of the most beautiful and longest beaches in the Caribbean"]
  },
  'gt': {
    fr: ["Berceau de la civilisation maya classique avec plus de 3 000 sites archéologiques dont Tikal", "Abrite le lac Atitlán, entouré de volcans, surnommé « le plus beau lac du monde » par Aldous Huxley", "Premier producteur mondial de cardamome, épice utilisée en cuisine et en médecine ayurvédique"],
    en: ["Birthplace of the Classic Maya civilization with over 3,000 archaeological sites including Tikal", "Home to Lake Atitlán, surrounded by volcanoes, nicknamed 'the world's most beautiful lake' by Aldous Huxley", "World's largest cardamom producer, a spice used in cooking and Ayurvedic medicine"]
  },
  'gl': {
    fr: ["Plus grande île du monde (si l'on exclut l'Australie, considérée comme un continent)", "Environ 80 % du territoire est recouvert par l'inlandsis, le deuxième plus grand glacier du monde", "Sa population de seulement 56 000 habitants en fait l'endroit le moins densément peuplé au monde par rapport à sa superficie"],
    en: ["World's largest island (excluding Australia, which is classified as a continent)", "About 80% of its territory is covered by the ice sheet, the world's second largest glacier", "Its population of only 56,000 makes it the least densely populated place in the world relative to its size"]
  },
  'gy': {
    fr: ["Seul pays anglophone d'Amérique du Sud", "Abrite les chutes Kaieteur, considérées comme les plus puissantes chutes d'eau du monde (débit et hauteur combinés)", "A découvert d'importants gisements de pétrole offshore en 2015, transformant radicalement son économie"],
    en: ["Only English-speaking country in South America", "Home to Kaieteur Falls, considered the world's most powerful waterfall (combined flow and height)", "Discovered major offshore oil deposits in 2015, radically transforming its economy"]
  },
  'ht': {
    fr: ["Premier pays à avoir réussi une révolution d'esclaves (1804), devenant la première République noire du monde", "A accueilli Simón Bolívar qui, renforcé ici, a ensuite libéré l'Amérique du Sud du colonialisme espagnol", "La citadelle Laferrière et le Sans-Souci sont inscrites au patrimoine mondial de l'UNESCO"],
    en: ["First country to complete a successful slave revolution (1804), becoming the world's first Black republic", "Sheltered Simón Bolívar who, reinforced here, then liberated South America from Spanish colonialism", "The Citadelle Laferrière and Sans-Souci Palace are inscribed on the UNESCO World Heritage List"]
  },
  'hn': {
    fr: ["Abrite Copán, l'une des cités mayas les plus importantes connue pour ses stèles sculptées uniques au monde", "Possède le deuxième plus grand récif corallien des Caraïbes (archipel des îles de la Baie)", "Berceau de l'acajou (caoba), l'un des bois les plus précieux et recherchés au monde"],
    en: ["Home to Copán, one of the most important Maya cities known for its unique sculpted stelae", "Has the second largest coral reef in the Caribbean (Bay Islands archipelago)", "Birthplace of mahogany (caoba), one of the world's most precious and sought-after woods"]
  },
  'ni': {
    fr: ["Abrite le lac Nicaragua (Cocibolca), le seul grand lac d'eau douce au monde abritant des requins bouledogues", "A le plus grand réseau de volcans actifs d'Amérique centrale, dont le Masaya qui crache de la lave en permanence", "Berceau du poète Rubén Darío, père du mouvement moderniste hispano-américain"],
    en: ["Home to Lake Nicaragua (Cocibolca), the world's only large freshwater lake with bull sharks", "Has the largest network of active volcanoes in Central America, including Masaya which permanently erupts lava", "Birthplace of poet Rubén Darío, father of the Spanish-American modernist movement"]
  },
  'py': {
    fr: ["L'un des deux seuls pays d'Amérique du Sud sans accès à la mer, avec la Bolivie", "Le guaraní, langue indigène, est parlé par 90 % de la population et co-officiel avec l'espagnol", "Abrite le barrage d'Itaipu (partagé avec le Brésil), qui fut la plus grande centrale hydroélectrique du monde"],
    en: ["One of only two South American countries without sea access, along with Bolivia", "Guaraní, an indigenous language, is spoken by 90% of the population and co-official with Spanish", "Home to the Itaipu Dam (shared with Brazil), which was the world's largest hydroelectric plant"]
  },
  'kn': {
    fr: ["Plus petit État souverain des Amériques (269 km²)", "Berceau des colonies européennes des Caraïbes : première colonie anglaise (1623) et française (1625)", "A inventé en 1984 le programme de « citoyenneté par investissement », depuis copié par de nombreux pays"],
    en: ["Smallest sovereign state in the Americas (269 km²)", "Cradle of European Caribbean colonies: first English (1623) and French (1625) settlements in the Caribbean", "Invented the 'citizenship by investment' program in 1984, since copied by many countries"]
  },
  'lc': {
    fr: ["A produit le plus grand nombre de lauréats du Prix Nobel par habitant au monde (deux prix Nobel pour 180 000 habitants)", "Surnommée « l'Hélène des Antilles », elle a changé 14 fois de mains entre la France et l'Angleterre", "Ses pitons jumeaux (Gros Piton et Petit Piton) sont inscrits au patrimoine mondial de l'UNESCO"],
    en: ["Has produced the most Nobel Prize winners per capita in the world (two Nobel Prizes for 180,000 people)", "Nicknamed 'the Helen of the West Indies', it changed hands 14 times between France and England", "Its twin Pitons (Gros Piton and Petit Piton) are inscribed on the UNESCO World Heritage List"]
  },
  'vc': {
    fr: ["Abrite la Soufrière, l'un des volcans les plus actifs des Caraïbes (éruption majeure en 2021)", "Seul endroit au monde où le perroquet amazone de Saint-Vincent vit à l'état sauvage", "Berceau des Garifuna, peuple métis afro-amérindien dont la langue et la culture sont inscrites à l'UNESCO"],
    en: ["Home to La Soufrière, one of the most active volcanoes in the Caribbean (major eruption in 2021)", "The only place in the world where the St. Vincent Amazon parrot lives in the wild", "Birthplace of the Garifuna people, an Afro-indigenous mixed culture inscribed on UNESCO's heritage list"]
  },
  'sr': {
    fr: ["Seul pays d'Amérique du Sud dont la langue officielle est le néerlandais", "93 % du territoire est couvert de forêt amazonienne, l'un des pays les plus boisés au monde", "Abrite une importante communauté marron (descendants d'esclaves africains évadés ayant recréé des sociétés africaines en Amazonie)"],
    en: ["Only South American country with Dutch as its official language", "93% of its territory is covered by Amazon rainforest, one of the world's most forested countries", "Home to a large Maroon community (descendants of escaped African slaves who recreated African societies in the Amazon)"]
  },
  'tt': {
    fr: ["Berceau du calypso, du soca et du steel pan, seul instrument de musique acoustique inventé au XXe siècle", "A le PIB par habitant le plus élevé de la région caribéenne grâce au pétrole et au gaz naturel", "Son carnaval est l'un des plus créatifs et colorés du monde, avec des costumes élaborés et des compétitions de calypso"],
    en: ["Birthplace of calypso, soca, and the steel pan, the only acoustic musical instrument invented in the 20th century", "Has the highest GDP per capita in the Caribbean region thanks to oil and natural gas", "Its carnival is one of the world's most creative and colorful, with elaborate costumes and calypso competitions"]
  },
  'uy': {
    fr: ["Premier pays d'Amérique latine à légaliser le cannabis à usage récréatif (2013)", "A accueilli et remporté la première Coupe du Monde de football de l'histoire (1930)", "L'un des pays les plus sécularisés et progressistes d'Amérique latine : mariage homosexuel légalisé en 2013"],
    en: ["First Latin American country to legalize cannabis for recreational use (2013)", "Hosted and won the first FIFA World Cup in history (1930)", "One of the most secular and progressive countries in Latin America: same-sex marriage legalized in 2013"]
  },

  // ===== ASIA (suite) =====
  'am': {
    fr: ["Premier pays au monde à avoir adopté le christianisme comme religion d'État (301 ap. J.-C.)", "Berceau de l'alphabet arménien (Mesrop Mashtots, 405 ap. J.-C.), utilisé sans interruption depuis 1 600 ans", "A subi le premier génocide reconnu du XXe siècle (1915), reconnu par plus de 30 États"],
    en: ["First country in the world to adopt Christianity as its state religion (301 AD)", "Birthplace of the Armenian alphabet (Mesrop Mashtots, 405 AD), in continuous use for 1,600 years", "Suffered the first recognized genocide of the 20th century (1915), recognized by over 30 states"]
  },
  'az': {
    fr: ["Surnommé « le pays du feu » : le site de Yanar Dağ brûle en continu depuis des millénaires grâce au gaz naturel", "A foré le premier puits de pétrole industriel au monde (Bakou, 1846)", "Sa musique mugham, mélange de poésie et d'improvisation, est inscrite au patrimoine immatériel de l'UNESCO"],
    en: ["Nicknamed 'the land of fire': the Yanar Dağ site has burned continuously for millennia thanks to natural gas", "Drilled the world's first industrial oil well (Baku, 1846)", "Its mugham music, a blend of poetry and improvisation, is inscribed on UNESCO's intangible heritage list"]
  },
  'bh': {
    fr: ["Abrite l'Arbre de Vie (Shajarat-al-Hayat), un arbre de 400 ans qui pousse seul au milieu du désert sans eau", "Berceau présumé de la civilisation de Dilmoun, mentionnée dans les textes sumériens comme le « jardin d'Éden »", "Premier pays du Golfe à avoir découvert du pétrole (1932) et à en avoir presque épuisé les réserves"],
    en: ["Home to the Tree of Life (Shajarat-al-Hayat), a 400-year-old tree growing alone in the desert with no water", "Presumed birthplace of the Dilmun civilization, mentioned in Sumerian texts as the 'Garden of Eden'", "First Gulf country to discover oil (1932) and to have nearly exhausted its reserves"]
  },
  'bt': {
    fr: ["Seul pays au monde à mesurer son progrès par l'indice du Bonheur National Brut plutôt que le PIB", "A interdit la télévision et internet jusqu'en 1999 pour préserver sa culture bouddhiste", "Seul pays au monde à avoir une empreinte carbone négative : il absorbe plus de CO₂ qu'il n'en émet"],
    en: ["Only country in the world measuring progress by Gross National Happiness rather than GDP", "Banned television and the internet until 1999 to preserve its Buddhist culture", "Only country in the world with a negative carbon footprint: it absorbs more CO₂ than it emits"]
  },
  'bn': {
    fr: ["Abrite le plus grand palais résidentiel au monde : l'Istana Nurul Iman (1 788 pièces)", "Son sultan, Hassanal Bolkiah, est l'une des personnes les plus riches du monde", "Entièrement enclavé dans la Malaisie sur l'île de Bornéo, traversé en deux par la ville malaisienne de Limbang"],
    en: ["Home to the world's largest residential palace: the Istana Nurul Iman (1,788 rooms)", "Its sultan, Hassanal Bolkiah, is one of the wealthiest people in the world", "Entirely landlocked within Malaysia on the island of Borneo, split in two by the Malaysian town of Limbang"]
  },
  'ge': {
    fr: ["Berceau du vin : les plus anciennes traces de vinification au monde ont été trouvées en Géorgie (6 000 av. J.-C.)", "La polyphonie chorale géorgienne, musique à plusieurs voix, est inscrite au patrimoine immatériel de l'UNESCO", "Abrite Vardzia, une ville entière creusée dans la roche volcanique au XIIe siècle sur ordre de la reine Tamar"],
    en: ["Birthplace of wine: the world's oldest evidence of winemaking was found in Georgia (6,000 BC)", "Georgian choral polyphony, a multi-voice music tradition, is inscribed on UNESCO's intangible heritage list", "Home to Vardzia, an entire city carved into volcanic rock in the 12th century by order of Queen Tamar"]
  },
  'iq': {
    fr: ["Berceau de la Mésopotamie, première grande civilisation de l'histoire humaine (Sumériens, ~3 500 av. J.-C.)", "A inventé l'écriture cunéiforme, le premier système d'écriture connu de l'humanité", "Abrite la ville d'Ur, berceau présumé d'Abraham et l'une des premières cités de l'histoire"],
    en: ["Birthplace of Mesopotamia, the first great civilization in human history (Sumerians, ~3,500 BC)", "Invented cuneiform writing, the world's first known writing system", "Home to the city of Ur, the presumed birthplace of Abraham and one of the earliest cities in history"]
  },
  'kw': {
    fr: ["A créé le premier fonds souverain d'investissement de l'histoire mondiale (Kuwait Investment Authority, 1953)", "Possède les sixièmes plus grandes réserves de pétrole au monde", "A été libéré lors de la Guerre du Golfe de 1991 par une coalition internationale de 35 pays"],
    en: ["Created the world's first sovereign wealth fund (Kuwait Investment Authority, 1953)", "Has the world's sixth largest oil reserves", "Was liberated during the 1991 Gulf War by an international coalition of 35 countries"]
  },
  'kg': {
    fr: ["Berceau de l'épopée de Manas, la plus longue épopée orale du monde (20 fois plus longue que l'Iliade)", "Abrite le lac Issyk-Koul, le deuxième plus grand lac de montagne au monde et l'un des plus profonds", "Berceau de la fauconnerie et de la culture nomade des yourtes des steppes d'Asie centrale"],
    en: ["Birthplace of the Epic of Manas, the world's longest oral epic poem (20 times longer than the Iliad)", "Home to Lake Issyk-Kul, the world's second largest mountain lake and one of the deepest", "Birthplace of falconry and the nomadic yurt culture of Central Asian steppes"]
  },
  'la': {
    fr: ["Pays le plus bombardé par habitant de l'Histoire : les États-Unis y ont largué plus de bombes que sur toute la Seconde Guerre mondiale (1964-1973)", "Abrite le Plateau des Jarres, mystérieux site mégalithique préhistorique inscrit au patrimoine mondial de l'UNESCO", "Seul pays enclavé d'Asie du Sud-Est, traversé par le Mékong sur 1 800 km"],
    en: ["The most heavily bombed country per capita in history: the US dropped more bombs here than in all of WWII combined (1964-1973)", "Home to the Plain of Jars, a mysterious prehistoric megalithic site inscribed on the UNESCO World Heritage List", "The only landlocked country in Southeast Asia, crossed by the Mekong River for 1,800km"]
  },
  'mv': {
    fr: ["Pays le plus plat du monde : l'altitude moyenne n'est que de 1,5 m au-dessus du niveau de la mer", "Premier pays du monde à tenir un conseil des ministres sous l'eau pour alerter sur la montée des océans (2009)", "Composé de 1 192 îles coralliennes réparties sur 90 000 km² d'océan Indien"],
    en: ["World's flattest country: average elevation is only 1.5m above sea level", "First country to hold a cabinet meeting underwater to highlight rising ocean levels (2009)", "Composed of 1,192 coral islands spread across 90,000 km² of the Indian Ocean"]
  },
  'mm': {
    fr: ["Abrite Bagan, plateau de plus de 2 000 temples et pagodes bouddhistes construits entre le IXe et le XIIIe siècle", "Premier producteur mondial de jade (plus de 90 % de la production mondiale)", "Classé pays le plus généreux au monde selon le World Giving Index, grâce aux dons aux moines bouddhistes"],
    en: ["Home to Bagan, a plateau with over 2,000 Buddhist temples and pagodas built between the 9th and 13th centuries", "World's largest jade producer (over 90% of global production)", "Ranked the world's most generous country by the World Giving Index, thanks to donations to Buddhist monks"]
  },
  'kp': {
    fr: ["A le troisième plus grand arsenal militaire au monde en nombre de soldats actifs (plus d'un million)", "Possède son propre fuseau horaire, l'heure de Pyongyang (UTC+9), rétablie en 2018", "Le mont Paektu (2 744 m) est considéré comme le berceau sacré et mythique de la nation coréenne"],
    en: ["Has the world's third largest military by number of active soldiers (over one million)", "Has its own time zone, Pyongyang Time (UTC+9), restored in 2018", "Mount Paektu (2,744m) is considered the sacred and mythical birthplace of the Korean nation"]
  },
  'om': {
    fr: ["Berceau de la navigation arabe antique et de la route de l'encens (frankincense) vers la Rome antique", "A le plus vieux sultanat en exercice au monde (dynastie Al-Saïd au pouvoir depuis 1744)", "Abrite le Wahiba Sands, mer de dunes parmi les plus pittoresques et accessibles du monde arabe"],
    en: ["Birthplace of ancient Arab navigation and the frankincense trade route to ancient Rome", "Has the world's oldest continuously ruling sultanate (Al-Said dynasty in power since 1744)", "Home to the Wahiba Sands, one of the most picturesque and accessible seas of dunes in the Arab world"]
  },
  'ps': {
    fr: ["Berceau de Jéricho, l'une des plus anciennes villes continuellement habitées au monde (plus de 10 000 ans)", "Abrite Bethléem, lieu de naissance de Jésus-Christ selon la tradition chrétienne et islamique", "Ses oliveraies comptent parmi les plus anciennes du monde, certains arbres vieux de plus de 5 000 ans"],
    en: ["Birthplace of Jericho, one of the world's oldest continuously inhabited cities (over 10,000 years)", "Home to Bethlehem, the birthplace of Jesus Christ according to Christian and Islamic tradition", "Its olive groves are among the world's oldest, with some trees over 5,000 years old"]
  },
  'qa': {
    fr: ["A organisé la première Coupe du Monde de football au Moyen-Orient et dans un pays arabe (2022)", "Possède les troisièmes plus grandes réserves de gaz naturel au monde", "A l'un des PIB par habitant les plus élevés du monde grâce à ses exportations de gaz naturel liquéfié"],
    en: ["Hosted the first FIFA World Cup in the Middle East and an Arab country (2022)", "Has the world's third largest natural gas reserves", "Has one of the world's highest GDP per capita thanks to its liquefied natural gas exports"]
  },
  'sy': {
    fr: ["Abrite Damas, considérée comme la capitale continuellement habitée la plus ancienne au monde (depuis 10 000 av. J.-C.)", "Berceau de l'alphabet araméen, la langue que parlait Jésus-Christ", "Abrite le Krak des Chevaliers, forteresse croisée considérée comme l'un des châteaux médiévaux les mieux conservés au monde"],
    en: ["Home to Damascus, considered the world's oldest continuously inhabited capital (since 10,000 BC)", "Birthplace of the Aramaic alphabet, the language spoken by Jesus Christ", "Home to the Krak des Chevaliers, a Crusader fortress considered one of the world's best-preserved medieval castles"]
  },
  'tj': {
    fr: ["Plus de 90 % du territoire est situé au-dessus de 1 000 m d'altitude, faisant du Tadjikistan le pays le plus montagneux du monde", "Abrite le glacier Fedchenko (77 km), le deuxième plus long glacier non polaire du monde", "Berceau de la civilisation sogdiane, carrefour de la Route de la Soie entre Chine et Occident"],
    en: ["Over 90% of its territory is above 1,000m altitude, making Tajikistan the world's most mountainous country", "Home to the Fedchenko Glacier (77km), the world's second longest non-polar glacier", "Birthplace of the Sogdian civilization, a crossroads of the Silk Road between China and the West"]
  },
  'tl': {
    fr: ["Parmi les pays les plus jeunes du monde, indépendant depuis 2002 après 24 ans d'occupation indonésienne", "Produit un café arabica de montagne parmi les plus prisés d'Asie du Sud-Est", "Constitue une frontière biogéographique (ligne de Wallace) entre les faunes asiatique et australasiatique"],
    en: ["Among the world's youngest countries, independent since 2002 after 24 years of Indonesian occupation", "Produces a mountain arabica coffee among the most prized in Southeast Asia", "Forms a biogeographic boundary (Wallace Line) between Asian and Australasian fauna"]
  },
  'tm': {
    fr: ["Abrite le cratère de Darvaza surnommé « Porte de l'Enfer », fosse de gaz qui brûle en continu depuis 1971", "L'un des pays les plus fermés au monde, avec une liberté de presse quasi inexistante", "Possède les quatrièmes plus grandes réserves de gaz naturel au monde"],
    en: ["Home to the Darvaza Crater nicknamed 'the Door to Hell', a gas pit that has burned continuously since 1971", "One of the world's most closed countries, with virtually no press freedom", "Has the world's fourth largest natural gas reserves"]
  },
  'uz': {
    fr: ["Abrite Samarcande, l'une des plus belles villes de la Route de la Soie avec le mausolée de Tamerlan", "Berceau d'Ibn Sina (Avicenne), fondateur de la médecine médiévale dont le Canon est encore étudié", "Deuxième producteur mondial de coton, avec des systèmes d'irrigation millénaires hérités des Sogdiens"],
    en: ["Home to Samarkand, one of the most beautiful cities on the Silk Road with the mausoleum of Tamerlane", "Birthplace of Ibn Sina (Avicenna), founder of medieval medicine whose Canon is still studied today", "Second largest cotton producer in the world, with millennia-old irrigation systems inherited from the Sogdians"]
  },
  'ye': {
    fr: ["Berceau présumé de la reine de Saba, selon la tradition biblique, coranique et éthiopienne", "Abrite l'île de Socotra, surnommée « les Galápagos de l'océan Indien » pour ses espèces végétales uniques", "La vieille ville de Sana'a est inscrite au patrimoine mondial de l'UNESCO pour son architecture millénaire"],
    en: ["Presumed birthplace of the Queen of Sheba, according to Biblical, Quranic and Ethiopian tradition", "Home to Socotra Island, nicknamed 'the Galápagos of the Indian Ocean' for its unique plant species", "The old city of Sana'a is on the UNESCO World Heritage List for its millennial architecture"]
  },

  // ===== EUROPE (suite) =====
  'al': {
    fr: ["L'un des pays les plus bunkerisés au monde : plus de 700 000 bunkers construits sous la dictature Hoxha", "Abrite Butrint, ancienne cité grecque et romaine classée au patrimoine mondial de l'UNESCO", "Mère Teresa, prix Nobel de la Paix, est d'origine albanaise (ses parents étaient albanais)"],
    en: ["One of the world's most bunkerized countries: over 700,000 bunkers built under the Hoxha dictatorship", "Home to Butrint, an ancient Greek and Roman city on the UNESCO World Heritage List", "Mother Teresa, Nobel Peace Prize winner, is of Albanian origin (her parents were Albanian)"]
  },
  'ad': {
    fr: ["Gouverné par deux co-princes depuis 1278 : l'évêque d'Urgell (Espagne) et le président de la France", "A l'une des espérances de vie les plus longues au monde (plus de 83 ans)", "L'une des densités de boutiques duty-free les plus élevées d'Europe, attirant les acheteurs des pays voisins"],
    en: ["Governed by two co-princes since 1278: the Bishop of Urgell (Spain) and the President of France", "Has one of the world's longest life expectancies (over 83 years)", "One of Europe's highest densities of duty-free shops, attracting buyers from neighboring countries"]
  },
  'by': {
    fr: ["Berceau de Marc Chagall, peintre expressionniste majeur du XXe siècle né à Vitebsk", "Abrite la forêt de Białowieża (partagée avec la Pologne), dernière forêt primaire d'Europe et refuge du bison européen", "Surnommée « les poumons de l'Europe » pour ses vastes forêts encore préservées"],
    en: ["Birthplace of Marc Chagall, a major expressionist painter of the 20th century born in Vitebsk", "Home to Białowieża Forest (shared with Poland), Europe's last primeval forest and refuge of the European bison", "Nicknamed 'the lungs of Europe' for its vast and still-preserved forests"]
  },
  'ba': {
    fr: ["L'assassinat de l'archiduc François-Ferdinand en 1914 dans sa capitale a déclenché la Première Guerre mondiale", "Sa capitale a accueilli les Jeux Olympiques d'hiver de 1984, apogée symbolique de la Yougoslavie", "Abrite Mostar et son pont Stari Most du XVIe siècle, inscrit au patrimoine mondial de l'UNESCO"],
    en: ["The assassination of Archduke Franz Ferdinand in 1914 in its capital triggered World War I", "Its capital hosted the 1984 Winter Olympic Games, the symbolic peak of Yugoslavia", "Home to Mostar and its 16th-century Stari Most bridge, inscribed on the UNESCO World Heritage List"]
  },
  'bg': {
    fr: ["Berceau de l'alphabet cyrillique (Saints Cyrille et Méthode, IXe siècle), aujourd'hui utilisé par plus de 250 millions de personnes", "A inventé le yaourt : les bactéries Lactobacillus bulgaricus portent le nom du pays", "Parmi les premiers producteurs mondiaux d'huile de rose, utilisée dans la parfumerie de luxe"],
    en: ["Birthplace of the Cyrillic alphabet (Saints Cyril and Methodius, 9th century), now used by over 250 million people", "Invented yogurt: the bacteria Lactobacillus bulgaricus bears the country's name", "Among the world's top producers of rose oil, used in luxury perfumery"]
  },
  'cy': {
    fr: ["Berceau présumé d'Aphrodite, déesse de l'amour dans la mythologie grecque (Petra tou Romiou)", "Le cuivre doit son nom à Chypre (Kypros en grec), où il était abondamment extrait dans l'Antiquité", "Île divisée depuis 1974 entre la République de Chypre (sud) et la partie nord sous administration turque"],
    en: ["Presumed birthplace of Aphrodite, goddess of love in Greek mythology (Petra tou Romiou)", "Copper takes its name from Cyprus (Kypros in Greek), where it was abundantly mined in antiquity", "Island divided since 1974 between the Republic of Cyprus (south) and the northern part under Turkish administration"]
  },
  'ee': {
    fr: ["Premier pays au monde à avoir organisé des élections nationales par internet (2005)", "Berceau de Skype, révolution mondiale de la communication vidéo en ligne", "Surnommée « la nation numérique » : parmi les pays avec le plus de start-ups et de services gouvernementaux en ligne"],
    en: ["First country in the world to hold national elections online (2005)", "Birthplace of Skype, a global revolution in online video communication", "Nicknamed 'the digital nation': among the countries with the most start-ups and online government services"]
  },
  'xk': {
    fr: ["L'un des pays les plus jeunes du monde, ayant déclaré son indépendance de la Serbie en 2008", "Abrite certains des monastères orthodoxes serbes médiévaux les plus importants des Balkans", "Sa population jeune (âge médian de 28 ans) et dynamique est l'une des plus jeunes d'Europe"],
    en: ["One of the world's youngest countries, having declared independence from Serbia in 2008", "Home to some of the most important medieval Serbian Orthodox monasteries in the Balkans", "Its young and dynamic population (median age 28) is one of the youngest in Europe"]
  },
  'lv': {
    fr: ["Abrite le plus grand festival choral au monde : le Festival de la Chanson de Lettonie (Latvijas Dziesmu svētki, tous les 5 ans)", "Berceau de Mikhail Baryshnikov, considéré comme le plus grand danseur de ballet classique du XXe siècle", "Possède l'un des plus vieux centres historiques de la Baltique : la vieille Riga, inscrite au patrimoine de l'UNESCO"],
    en: ["Hosts the world's largest choral festival: the Latvian Song and Dance Celebration (every 5 years)", "Birthplace of Mikhail Baryshnikov, considered the greatest classical ballet dancer of the 20th century", "Has one of the oldest historic centers in the Baltics: Old Riga, inscribed on the UNESCO Heritage list"]
  },
  'li': {
    fr: ["L'un des deux seuls pays au monde doublement enclavés (entouré uniquement par des pays eux-mêmes enclavés), avec l'Ouzbékistan", "A aboli son armée en 1868 après avoir perdu sa seule guerre, sans aucune victime côté liechtensteinois", "Quatrième plus petit pays d'Europe (160 km²) mais l'un des plus riches du monde par habitant"],
    en: ["One of only two doubly landlocked countries in the world (surrounded only by landlocked countries), with Uzbekistan", "Abolished its army in 1868 after losing its only war, with no casualties on the Liechtenstein side", "Fourth smallest country in Europe (160 km²) but one of the world's richest per capita"]
  },
  'lt': {
    fr: ["A eu le plus grand empire d'Europe au XIVe siècle (Grand-Duché de Lituanie, de la mer Baltique à la mer Noire)", "Première nation soviétique à déclarer son indépendance de l'URSS (11 mars 1990)", "Sport national : le basket-ball — pays le plus passionné de basket en Europe, avec plusieurs Champions d'Europe"],
    en: ["Had the largest empire in Europe in the 14th century (Grand Duchy of Lithuania, from the Baltic to the Black Sea)", "First Soviet nation to declare independence from the USSR (March 11, 1990)", "National sport: basketball — the most basketball-passionate country in Europe, with several European champions"]
  },
  'lu': {
    fr: ["A le PIB par habitant le plus élevé au monde selon plusieurs classements internationaux", "Seul Grand-Duché encore en exercice dans le monde", "Siège de nombreuses institutions européennes majeures : Cour de Justice de l'UE, Cour des Comptes européenne"],
    en: ["Has the world's highest GDP per capita according to several international rankings", "The world's only remaining Grand Duchy", "Headquarters of major European institutions: EU Court of Justice, European Court of Auditors"]
  },
  'mt': {
    fr: ["Abrite les temples de Ġgantija, les plus anciennes structures mégalithiques au monde (3 600 av. J.-C., plus vieux que Stonehenge)", "Seul pays au monde dont la langue officielle, le maltais, est d'origine arabe mais écrite en alphabet latin", "Sa résistance héroïque au siège nazi de 1940-1942 lui a valu la Croix de Saint-Georges, décoration britannique suprême"],
    en: ["Home to the Ġgantija temples, the world's oldest megalithic structures (3,600 BC, older than Stonehenge)", "Only country in the world whose official language, Maltese, is of Arabic origin but written in the Latin alphabet", "Its heroic resistance during the WWII siege of 1940-1942 earned it the George Cross, the UK's highest civilian decoration"]
  },
  'md': {
    fr: ["Abrite la plus grande cave à vin du monde : les caves de Cricova (120 km de galeries souterraines)", "Produit certains des vins les plus appréciés de l'espace post-soviétique, avec des traditions millénaires", "La forêt de Codrii est l'une des dernières forêts anciennes d'Europe centrale encore préservée"],
    en: ["Home to the world's largest wine cellar: the Cricova cellars (120km of underground galleries)", "Produces some of the most appreciated wines in the post-Soviet space, with millennial traditions", "The Codrii forest is one of the last ancient forests in central Europe still preserved"]
  },
  'mc': {
    fr: ["Deuxième plus petit pays au monde (2 km²) avec la densité de population la plus élevée du monde", "A la plus forte concentration de milliardaires par habitant au monde", "N'a pas d'impôt sur le revenu pour ses résidents depuis 1869, l'un des plus vieux paradis fiscaux d'Europe"],
    en: ["Second smallest country in the world (2 km²) with the world's highest population density", "Has the world's highest concentration of billionaires per capita", "Has had no income tax for residents since 1869, one of Europe's oldest tax havens"]
  },
  'me': {
    fr: ["Son nom signifie « montagne noire » (Monte Negro en vénitien), d'où sa couleur sombre sur les vieilles cartes", "Abrite le canyon de la Tara, le deuxième plus profond canyon d'Europe (1 300 m) et site UNESCO", "L'un des rares États européens à avoir résisté militairement à l'Empire ottoman pendant des siècles"],
    en: ["Its name means 'black mountain' (Monte Negro in Venetian), reflecting its dark appearance on old maps", "Home to the Tara River Canyon, Europe's second deepest canyon (1,300m) and a UNESCO site", "One of the few European states to have militarily resisted the Ottoman Empire for centuries"]
  },
  'mk': {
    fr: ["Patrie d'Alexandre le Grand, qui a bâti l'un des plus grands empires de l'Antiquité au IVe siècle av. J.-C.", "Berceau de Mère Teresa (née Anjezë Bojaxhiu en 1910), Prix Nobel de la Paix 1979", "Abrite le lac d'Ohrid, l'un des plus anciens lacs d'Europe (3 à 5 millions d'années) et site double UNESCO"],
    en: ["Homeland of Alexander the Great, who built one of the greatest empires of antiquity in the 4th century BC", "Birthplace of Mother Teresa (born Anjezë Bojaxhiu in 1910), Nobel Peace Prize 1979", "Home to Lake Ohrid, one of Europe's oldest lakes (3-5 million years) and a double UNESCO site"]
  },
  'sm': {
    fr: ["Le plus ancien pays souverain du monde encore en existence, fondé selon la tradition en 301 ap. J.-C.", "Plus ancienne République du monde en exercice continu (démocratie sans interruption depuis 1243)", "Entièrement enclavé dans l'Italie, avec le mont Titano comme emblème national et forteresse médiévale"],
    en: ["The world's oldest surviving sovereign country, founded according to tradition in 301 AD", "The world's oldest republic in continuous operation (uninterrupted democracy since 1243)", "Entirely landlocked within Italy, with Monte Titano as its national emblem and medieval fortress"]
  },
  'sk': {
    fr: ["Abrite le château de Spiš, la plus grande forteresse médiévale d'Europe centrale par sa superficie, inscrite à l'UNESCO", "Possède plus de 180 châteaux et châteaux forts, l'une des plus grandes densités de châteaux au monde", "Les parents d'Andy Warhol, icône du Pop Art américain, étaient originaires d'un village slovaque"],
    en: ["Home to Spiš Castle, the largest medieval fortress in Central Europe by area, inscribed on UNESCO's list", "Has over 180 castles and fortresses, one of the world's highest castle densities", "Andy Warhol's parents, icons of American Pop Art, came from a Slovak village"]
  },
  'si': {
    fr: ["Premier pays ex-yougoslave à rejoindre l'Union Européenne et la zone euro (2004 et 2007)", "Abrite la grotte de Postojna, le plus grand réseau de grottes karstiques d'Europe (24 km de galeries)", "80 % de son électricité provient de sources d'énergie bas-carbone (nucléaire et hydraulique)"],
    en: ["First former Yugoslav country to join the European Union and the Eurozone (2004 and 2007)", "Home to Postojna Cave, Europe's largest karst cave system (24km of galleries)", "80% of its electricity comes from low-carbon energy sources (nuclear and hydroelectric)"]
  },
  'va': {
    fr: ["Plus petit État souverain du monde (0,44 km²), résidence du pape et siège de l'Église catholique romaine", "Abrite la chapelle Sixtine peinte par Michel-Ange et la Pietà, deux des plus grands chefs-d'œuvre de l'art mondial", "Possède sa propre banque, sa propre armée (la Garde suisse, fondée en 1506) et le latin comme langue officielle"],
    en: ["World's smallest sovereign state (0.44 km²), residence of the Pope and seat of the Roman Catholic Church", "Home to the Sistine Chapel painted by Michelangelo and the Pietà, two of the world's greatest masterpieces", "Has its own bank, its own army (the Swiss Guard, founded in 1506), and Latin as an official language"]
  },

  // ===== OCEANIA (suite) =====
  'ki': {
    fr: ["Premier pays au monde à avoir accueilli le nouveau millénaire (île Christmas, 1er janvier 2000)", "L'un des rares pays à s'étendre sur les quatre hémisphères (nord, sud, est et ouest) simultanément", "Risque de disparaître entièrement d'ici la fin du siècle à cause de la montée du niveau des mers"],
    en: ["First country in the world to welcome the new millennium (Christmas Island, January 1, 2000)", "One of the rare countries to span all four hemispheres (north, south, east and west) simultaneously", "At risk of entirely disappearing by the end of the century due to rising sea levels"]
  },
  'mh': {
    fr: ["A subi plus de 60 essais nucléaires américains entre 1946 et 1958, notamment à Bikini (qui a donné son nom au maillot de bain)", "Abrite l'atoll de Bikini, inscrit au patrimoine mondial de l'UNESCO en raison de son histoire nucléaire", "Parmi les nations les plus menacées au monde par la montée des océans (altitude moyenne < 2 m)"],
    en: ["Suffered over 60 US nuclear tests between 1946 and 1958, notably at Bikini Atoll (which gave its name to the swimsuit)", "Home to Bikini Atoll, inscribed on the UNESCO World Heritage List for its nuclear history", "Among the world's most threatened nations from rising sea levels (average altitude < 2m)"]
  },
  'fm': {
    fr: ["Abrite Nan Madol, mystérieuse cité construite sur des îlots artificiels surnommée « la Venise du Pacifique »", "Le lagon de Chuuk (Truk) abrite la plus grande concentration d'épaves de la Seconde Guerre mondiale au monde", "Plus de 600 îles réparties sur 2 700 km d'océan composent cet archipel micronésien"],
    en: ["Home to Nan Madol, a mysterious city built on artificial islets nicknamed 'the Venice of the Pacific'", "Chuuk (Truk) Lagoon holds the world's greatest concentration of WWII shipwrecks", "Over 600 islands spread across 2,700 km of ocean make up this Micronesian archipelago"]
  },
  'nr': {
    fr: ["Troisième plus petit pays du monde (21 km²), après le Vatican et Monaco", "A eu le revenu par habitant le plus élevé au monde dans les années 1970 grâce au phosphate, avant d'épuiser ses réserves", "L'un des pays avec les taux d'obésité les plus élevés au monde, héritage des changements alimentaires postcoloniaux"],
    en: ["Third smallest country in the world (21 km²), after Vatican and Monaco", "Had the world's highest per capita income in the 1970s thanks to phosphate, before exhausting its reserves", "One of the countries with the world's highest obesity rates, a legacy of post-colonial dietary changes"]
  },
  'pw': {
    fr: ["Abrite le lac des Méduses, lac d'eau de mer isolé abritant des millions de méduses non venimeuses", "Premier pays au monde à créer un sanctuaire marin national couvrant l'intégralité de ses eaux (2009)", "Considéré comme l'un des dix meilleurs sites de plongée au monde pour la diversité de sa vie marine"],
    en: ["Home to Jellyfish Lake, an isolated saltwater lake housing millions of non-venomous jellyfish", "First country in the world to create a national marine sanctuary covering all of its waters (2009)", "Considered one of the world's top ten diving destinations for the diversity of its marine life"]
  },
  'ws': {
    fr: ["A changé de côté de la ligne internationale de changement de date en 2011, « sautant » un jeudi entier", "Abrite le To Sua Ocean Trench, une piscine naturelle géante creusée dans la roche volcanique", "Berceau de la danse siva, forme de danse polynésienne traditionnelle et expressive"],
    en: ["Changed sides of the International Date Line in 2011, 'skipping' an entire Thursday", "Home to the To Sua Ocean Trench, a giant natural swimming hole carved into volcanic rock", "Birthplace of the siva dance, a traditional and expressive form of Polynesian dance"]
  },
  'sb': {
    fr: ["Théâtre de la bataille de Guadalcanal (1942-1943), l'une des batailles navales et terrestres les plus décisives du Pacifique", "Abrite l'une des plus grandes forêts tropicales du Pacifique, riche en espèces endémiques", "Parmi les pays les plus linguistiquement divers au monde (plus de 70 langues pour 700 000 habitants)"],
    en: ["Site of the Battle of Guadalcanal (1942-1943), one of the most decisive naval and land battles in the Pacific", "Home to one of the largest tropical rainforests in the Pacific, rich in endemic species", "Among the world's most linguistically diverse countries (over 70 languages for 700,000 people)"]
  },
  'to': {
    fr: ["Seul pays polynésien à n'avoir jamais été colonisé par une puissance étrangère", "Royaume constitutionnel, l'une des seules monarchies encore en exercice dans le Pacifique", "Berceau de la danse lakalaka, danse traditionnelle polynésienne inscrite au patrimoine immatériel de l'UNESCO"],
    en: ["Only Polynesian country never to have been colonized by a foreign power", "Constitutional kingdom, one of the only remaining monarchies in the Pacific", "Birthplace of the lakalaka dance, a traditional Polynesian dance inscribed on UNESCO's intangible heritage list"]
  },
  'tv': {
    fr: ["Quatrième plus petit pays du monde et risque de disparaître dans les prochaines décennies à cause de la montée des eaux", "A vendu le domaine internet « .tv » à des chaînes du monde entier, finançant ainsi une grande partie de son budget national", "Sa population d'environ 11 000 habitants en fait l'un des États souverains les moins peuplés au monde"],
    en: ["Fourth smallest country in the world, at risk of disappearing in the coming decades due to rising sea levels", "Sold the '.tv' internet domain to TV channels worldwide, financing a large portion of its national budget", "Its population of about 11,000 makes it one of the world's least populated sovereign states"]
  },
  'vu': {
    fr: ["Abrite le volcan Yasur, l'un des volcans les plus accessibles et actifs du monde (en activité continue depuis 800 ans)", "Berceau du saut de Pentecôte (land diving), ancêtre du saut à l'élastique pratiqué comme rite de passage masculin", "L'un des pays les plus vulnérables aux catastrophes naturelles : cyclones, éruptions volcaniques et tsunamis"],
    en: ["Home to Yasur Volcano, one of the world's most accessible and active volcanoes (continuously active for 800 years)", "Birthplace of Pentecost land diving, the ancestor of bungee jumping practiced as a male rite of passage", "One of the world's most vulnerable countries to natural disasters: cyclones, volcanic eruptions and tsunamis"]
  }
};
