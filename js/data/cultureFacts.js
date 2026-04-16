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
    fr: ["A colonisé la majeure partie de l'Amérique du Sud au XVIe siècle", "Deuxième pays le plus visité au monde (avant la pandémie)", "Deuxième langue maternelle la plus parlée au monde (espagnol)"],
    en: ["Colonized most of South America in the 16th century", "Second most visited country in the world (pre-pandemic)", "Spanish is the world's second most spoken native language"]
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
    fr: ["A inventé les frites malgré leur nom « French Fries »", "Produit plus de 1 500 types de bières différentes", "Capitale de facto de l'Union Européenne (Bruxelles)"],
    en: ["Invented French fries, despite the name", "Produces over 1,500 different types of beer", "De facto capital of the European Union (Brussels)"]
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
    fr: ["A inventé les lentilles de contact souples (Otto Wichterle, 1961)", "Pays avec la consommation de bière per capita la plus élevée au monde", "Sa capitale Prague est surnommée « la Ville aux cent clochers »"],
    en: ["Invented soft contact lenses (Otto Wichterle, 1961)", "Country with the world's highest per capita beer consumption", "Its capital Prague is known as 'the City of a Hundred Spires'"]
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
    fr: ["Seul pays au monde à chevaucher deux continents (Europe et Asie)", "Berceau de la cerise : le mot vient de Giresun (anciennement Kerasus)", "A la première cafégothèque du monde (Istanbul, 1554)"],
    en: ["Only country in the world straddling two continents (Europe and Asia)", "Birthplace of the cherry: the word comes from Giresun (ancient Cerasus)", "Home to the world's first coffeehouse (Istanbul, 1554)"]
  },
  'ru': {
    fr: ["Plus grand pays du monde, couvrant 11 fuseaux horaires", "A lancé le premier satellite artificiel (Spoutnik, 1957) et envoyé le premier homme dans l'espace", "Le lac Baïkal contient 20 % des réserves mondiales d'eau douce de surface"],
    en: ["World's largest country, spanning 11 time zones", "Launched the first artificial satellite (Sputnik, 1957) and sent the first human to space", "Lake Baikal contains 20% of the world's surface fresh water"]
  },
  'ua': {
    fr: ["Grenier à blé de l'Europe et premier exportateur mondial d'huile de tournesol", "Kiev est l'une des plus anciennes villes d'Europe de l'Est (fondée au IXe siècle)", "Possède la plus grande centrale nucléaire d'Europe (Zaporijjia)"],
    en: ["Europe's breadbasket and world's largest sunflower oil exporter", "Kyiv is one of the oldest cities in Eastern Europe (founded in the 9th century)", "Home to Europe's largest nuclear power plant (Zaporizhzhia)"]
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
    fr: ["A inventé la cravate (le mot vient de « Croate »)", "Berceau supposé de Marco Polo (île de Korčula)", "Ses chutes de Plitvice figurent parmi les plus belles d'Europe"],
    en: ["Invented the necktie (the word comes from 'Croat')", "Claimed birthplace of Marco Polo (island of Korčula)", "Its Plitvice Lakes are among the most beautiful waterfalls in Europe"]
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
    fr: ["Traversé par l'équateur qui lui donne son nom", "Abrite les îles Galápagos, source d'inspiration de la théorie de l'évolution de Darwin", "Premier pays à inscrire les droits de la nature dans sa Constitution (2008)"],
    en: ["Crossed by the equator that gives it its name", "Home to the Galápagos Islands, which inspired Darwin's theory of evolution", "First country to enshrine the rights of nature in its Constitution (2008)"]
  },
  've': {
    fr: ["Abrite le Salto Angel, la plus haute chute d'eau du monde (979 m)", "Possède les plus grandes réserves de pétrole prouvées au monde", "A un des plus grands carnavals d'Amérique latine (Carnaval de Barranquilla)"],
    en: ["Home to Angel Falls, the world's highest waterfall (979m)", "Has the world's largest proven oil reserves", "Has one of Latin America's greatest carnivals (Barranquilla Carnival)"]
  },
  'pa': {
    fr: ["Abrite le canal de Panama, l'une des voies navigables les plus importantes au monde", "A donné son nom à un célèbre chapeau à larges bords, fabriqué en réalité en Équateur", "Pont terrestre entre l'Amérique du Nord et l'Amérique du Sud"],
    en: ["Home to the Panama Canal, one of the world's most important waterways", "Gave its name to a famous wide-brimmed hat, despite it actually being made in Ecuador", "Land bridge connecting North and South America"]
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
    fr: ["Seul pays d'Asie du Sud-Est à n'avoir jamais été colonisé par une puissance européenne", "Abrite le plus grand nombre de temples bouddhistes au monde", "Berceau de la boxe thaïlandaise (Muay Thai)"],
    en: ["Only Southeast Asian country never colonized by a European power", "Home to the world's greatest number of Buddhist temples", "Birthplace of Thai boxing (Muay Thai)"]
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
  }
};
