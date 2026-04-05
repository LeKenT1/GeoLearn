window.GL = window.GL || {};

GL.Profile = {
  STORAGE_KEY: 'gl_profile',

  _t(key) { return GL.I18N ? GL.I18N.t(key) : key; },

  // ===== TYPES DE PERSONNAGE =====
  STYLES: [
    { id: 'avataaars', emoji: '👤', label: 'Humain',      desc: 'Avatar humain détaillé' },
    { id: 'bottts',    emoji: '🤖', label: 'Robot',        desc: 'Petit robot sympathique' },
    { id: 'fun-emoji', emoji: '😄', label: 'Emoji',        desc: 'Émoji expressif' },
    { id: 'pixel-art', emoji: '🎮', label: 'Pixel Art',    desc: 'Héros 8-bit' },
    { id: 'adventurer',emoji: '🧝', label: 'Aventurier',   desc: 'Héros fantaisie' },
    { id: 'lorelei',   emoji: '🔮', label: 'Mystique',     desc: 'Personnage illustré' },
    { id: 'big-smile',  emoji: '😁', label: 'Grand Sourire', desc: 'Personnage souriant coloré' },
    { id: 'notionists', emoji: '💭', label: 'Notioniste',   desc: 'Style illustré Notion' },
    { id: 'toon-head',  emoji: '🗿', label: 'Toonhead',     desc: 'Tête cartoon déformée' },
    { id: 'dylan',      emoji: '🌀', label: 'Dylan',        desc: 'Personnage tourbillonnant' },
    { id: 'croodles',   emoji: '🐛', label: 'Croodles',     desc: 'Gribouillage rigolo' },
    { id: 'bottts-neutral', emoji: '🦿', label: 'Bottts Neutre', desc: 'Robot sans visage' },
  ],

  // ===== OPTIONS UNIVERSELLES =====
  BG_COLORS: [
    { val: 'b6e3f4', color: '#b6e3f4', label: 'Ciel'        },
    { val: 'c0aede', color: '#c0aede', label: 'Lavande'     },
    { val: 'd1d4f9', color: '#d1d4f9', label: 'Bluet'       },
    { val: 'ffd5dc', color: '#ffd5dc', label: 'Rose'        },
    { val: 'ffdfbf', color: '#ffdfbf', label: 'Pêche'       },
    { val: 'c1f4c5', color: '#c1f4c5', label: 'Menthe'      },
    { val: 'a7ffc4', color: '#a7ffc4', label: 'Vert'        },
    { val: 'ffffb1', color: '#ffffb1', label: 'Jaune'       },
    { val: '4f63ff', color: '#4f63ff', label: 'Bleu vif'    },
    { val: 'ffffff', color: '#ffffff', label: 'Blanc'       },
    { val: 'f0f0f0', color: '#f0f0f0', label: 'Gris clair'  },
    { val: '8e8e8e', color: '#8e8e8e', label: 'Gris'        },
    { val: '2d2d2d', color: '#2d2d2d', label: 'Ardoise'     },
    { val: '000000', color: '#000000', label: 'Noir'        },
    { val: 'ff5c5c', color: '#ff5c5c', label: 'Rouge'       },
    { val: 'ff8c00', color: '#ff8c00', label: 'Orange'      },
    { val: 'ffd700', color: '#ffd700', label: 'Or'          },
    { val: '7fff00', color: '#7fff00', label: 'Lime'        },
    { val: '00c8a0', color: '#00c8a0', label: 'Émeraude'    },
    { val: '00bfff', color: '#00bfff', label: 'Cyan'        },
    { val: '9747ff', color: '#9747ff', label: 'Violet'      },
    { val: 'ff69b4', color: '#ff69b4', label: 'Fuchsia'     },
    { val: 'f4a460', color: '#f4a460', label: 'Sable'       },
    { val: 'deb887', color: '#deb887', label: 'Bois'        },
    { val: 'a0522d', color: '#a0522d', label: 'Terre'       },
    { val: '2e4a1e', color: '#2e4a1e', label: 'Forêt'       },
    { val: '0d3b6e', color: '#0d3b6e', label: 'Océan'       },
    { val: '4b0082', color: '#4b0082', label: 'Indigo'      },
    { val: '8b0000', color: '#8b0000', label: 'Bordeaux'    },
  ],

  // ===== OPTIONS AVATAAARS (humain) =====
  TOPS: [
    { val: 'bigHair',              label: 'Volumineux',   group: 'long' },
    { val: 'bob',                  label: 'Bob',          group: 'long' },
    { val: 'bun',                  label: 'Chignon',      group: 'long' },
    { val: 'curly',                label: 'Bouclé',       group: 'long' },
    { val: 'curvy',                label: 'Ondulé',       group: 'long' },
    { val: 'dreads',               label: 'Dreads',       group: 'long' },
    { val: 'froBand',              label: 'Fro Bandeau',  group: 'long' },
    { val: 'longButNotTooLong',    label: 'Mi-long',      group: 'long' },
    { val: 'miaWallace',           label: 'Mia Wallace',  group: 'long' },
    { val: 'shavedSides',          label: 'Dégradé',      group: 'long' },
    { val: 'straight01',           label: 'Lisse',        group: 'long' },
    { val: 'straight02',           label: 'Lisse 2',      group: 'long' },
    { val: 'straightAndStrand',    label: 'Mèche',        group: 'long' },
    { val: 'dreads01',             label: 'Dreads Cts.',  group: 'short' },
    { val: 'dreads02',             label: 'Dreads Fins',  group: 'short' },
    { val: 'frizzle',              label: 'Frisé',        group: 'short' },
    { val: 'shortCurly',           label: 'Court Bouclé', group: 'short' },
    { val: 'shortFlat',            label: 'Court Plat',   group: 'short' },
    { val: 'shortRound',           label: 'Court Rond',   group: 'short' },
    { val: 'shortWaved',           label: 'Court Ondulé', group: 'short' },
    { val: 'sides',                label: 'Côtés',        group: 'short' },
    { val: 'theCaesar',            label: 'César',        group: 'short' },
    { val: 'theCaesarAndSidePart', label: 'César+Raie',   group: 'short' },
    { val: 'hat',                  label: '🎩 Chapeau',   group: 'hat' },
    { val: 'hijab',                label: '🧕 Hijab',     group: 'hat' },
    { val: 'turban',               label: '👳 Turban',    group: 'hat' },
    { val: 'winterHat1',           label: '🧢 Bonnet 1',  group: 'hat' },
    { val: 'winterHat02',          label: '🧢 Bonnet 2',  group: 'hat' },
    { val: 'winterHat03',          label: '🧢 Bonnet 3',  group: 'hat' },
    { val: 'winterHat04',          label: '🧢 Bonnet 4',  group: 'hat' },
  ],
  HAIR_COLORS: [
    { val: '2c1b18', color: '#2c1b18', label: 'Noir'     },
    { val: '4a312c', color: '#4a312c', label: 'Brun F.'  },
    { val: 'a55728', color: '#a55728', label: 'Châtain'  },
    { val: 'b58143', color: '#b58143', label: 'Doré'     },
    { val: 'd6b370', color: '#d6b370', label: 'Blond'    },
    { val: 'c93305', color: '#c93305', label: 'Roux'     },
    { val: 'afafaf', color: '#afafaf', label: 'Gris'     },
    { val: 'e8e1e1', color: '#e8e1e1', label: 'Blanc'    },
    { val: '6bd9e9', color: '#6bd9e9', label: 'Bleu 💙'  },
    { val: 'fc909f', color: '#fc909f', label: 'Rose 🌸'  },
    { val: 'f59797', color: '#f59797', label: 'Corail'   },
    { val: 'ffe4b5', color: '#ffe4b5', label: 'Platine'  },
  ],
  HAT_COLORS: [
    { val: '262e33', color: '#262e33', label: 'Noir'   },
    { val: '3c4f5c', color: '#3c4f5c', label: 'Marine' },
    { val: '65c9ff', color: '#65c9ff', label: 'Bleu'   },
    { val: 'a7ffc4', color: '#a7ffc4', label: 'Menthe' },
    { val: 'ff5c5c', color: '#ff5c5c', label: 'Rouge'  },
    { val: 'e6e6e6', color: '#e6e6e6', label: 'Gris'   },
    { val: 'ffafb9', color: '#ffafb9', label: 'Rose'   },
    { val: 'ffffb1', color: '#ffffb1', label: 'Jaune'  },
  ],
  SKIN_COLORS: [
    { val: '614335', color: '#614335', label: 'Profonde' },
    { val: 'ae5d29', color: '#ae5d29', label: 'Foncée'   },
    { val: 'd08b5b', color: '#d08b5b', label: 'Caramel'  },
    { val: 'edb98a', color: '#edb98a', label: 'Dorée'    },
    { val: 'ffdbb4', color: '#ffdbb4', label: 'Claire'   },
    { val: 'f8d25c', color: '#f8d25c', label: 'Soleil'   },
    { val: 'fd9841', color: '#fd9841', label: 'Halée'    },
  ],
  EYES: [
    { val: 'default',   label: 'Normal'  }, { val: 'happy',     label: 'Joyeux'  },
    { val: 'wink',      label: 'Clin d\'œil' }, { val: 'hearts', label: '❤️ Amour' },
    { val: 'surprised', label: 'Surpris' }, { val: 'squint',    label: 'Plissés' },
    { val: 'cry',       label: '😢 Larmes' }, { val: 'xDizzy',  label: '✕ Tournés' },
    { val: 'side',      label: 'De côté' },
    { val: 'eyeRoll',   label: 'Au ciel' }, { val: 'closed',    label: 'Fermés'  },
    { val: 'winkWacky', label: 'Fou'     },
  ],
  EYEBROWS: [
    { val: 'defaultNatural',       label: 'Naturels'    },
    { val: 'raisedExcitedNatural', label: 'Surpris'     },
    { val: 'upDownNatural',        label: 'Asymétriques'},
    { val: 'flatNatural',          label: 'Plats'       },
    { val: 'frownNatural',         label: 'Froncés'     },
    { val: 'sadConcernedNatural',  label: 'Tristes'     },
    { val: 'angryNatural',         label: 'En colère'   },
    { val: 'unibrowNatural',       label: 'Monosourcil' },
    { val: 'raisedExcited',        label: 'Hauts'       },
    { val: 'upDown',               label: 'Haut/Bas'    },
    { val: 'sadConcerned',         label: 'Inquiets'    },
  ],
  MOUTHS: [
    { val: 'smile',      label: 'Sourire'  }, { val: 'default',  label: 'Neutre'  },
    { val: 'twinkle',    label: 'Espiègle' }, { val: 'tongue',   label: '😛 Langue' },
    { val: 'grimace',    label: 'Grimace'  }, { val: 'eating',   label: '😋 Gourmand' },
    { val: 'disbelief',  label: 'Incrédule'}, { val: 'screamOpen',label: '😱 Cri' },
    { val: 'concerned',  label: 'Inquiet'  }, { val: 'serious',  label: 'Sérieux' },
    { val: 'sad',        label: 'Triste'   }, { val: 'vomit',    label: '🤮 Dégouté' },
  ],
  FACIAL_HAIR: [
    { val: 'blank',          label: 'Aucune'       },
    { val: 'beardLight',     label: 'Barbe Légère' },
    { val: 'beardMedium',    label: 'Barbe Moyenne'},
    { val: 'beardMajestic',  label: 'Barbe Royale' },
    { val: 'moustacheFancy', label: 'Moustache'    },
    { val: 'moustacheMagnum',label: 'Magnum P.I.'  },
  ],
  FACIAL_HAIR_COLORS: [
    { val: '2c1b18', color: '#2c1b18', label: 'Noir'   },
    { val: '4a312c', color: '#4a312c', label: 'Brun'   },
    { val: 'a55728', color: '#a55728', label: 'Châtain'},
    { val: 'c93305', color: '#c93305', label: 'Roux'   },
    { val: 'afafaf', color: '#afafaf', label: 'Gris'   },
    { val: 'e8e1e1', color: '#e8e1e1', label: 'Blanc'  },
  ],
  ACCESSORIES: [
    { val: 'blank',          label: 'Aucun'     },
    { val: 'kurt',           label: 'Kurt'      },
    { val: 'prescription01', label: 'Optiques 1'},
    { val: 'prescription02', label: 'Optiques 2'},
    { val: 'round',          label: 'Rondes'    },
    { val: 'sunglasses',     label: '😎 Soleil' },
    { val: 'wayfarers',      label: 'Wayfarers' },
  ],
  ACCESSORIES_COLORS: [
    { val: '262e33', color: '#262e33', label: 'Noir'   },
    { val: '3c4f5c', color: '#3c4f5c', label: 'Marine' },
    { val: '65c9ff', color: '#65c9ff', label: 'Bleu'   },
    { val: 'a7ffc4', color: '#a7ffc4', label: 'Vert'   },
    { val: 'ff5c5c', color: '#ff5c5c', label: 'Rouge'  },
    { val: 'ffd600', color: '#ffd600', label: 'Or'     },
    { val: 'ffafb9', color: '#ffafb9', label: 'Rose'   },
  ],
  CLOTHING: [
    { val: 'hoodie',           label: '🧥 Hoodie'       },
    { val: 'blazerAndShirt',   label: '👔 Blazer+Chemise'},
    { val: 'blazerAndSweater', label: '🧣 Blazer+Pull'  },
    { val: 'collarAndSweater', label: '🎽 Col+Pull'     },
    { val: 'graphicShirt',     label: '🎨 T-Shirt Print'},
    { val: 'shirtCrewNeck',    label: '👕 Col Rond'     },
    { val: 'shirtScoopNeck',   label: '👗 Col Bateau'   },
    { val: 'shirtVNeck',       label: '👕 Col V'        },
    { val: 'overall',          label: '🧑‍🌾 Salopette'   },
  ],
  CLOTHING_COLORS: [
    { val: '9287ff', color: '#9287ff', label: 'Violet'   },
    { val: '65c9ff', color: '#65c9ff', label: 'Bleu ciel'},
    { val: '25557c', color: '#25557c', label: 'Marine'   },
    { val: 'a7ffc4', color: '#a7ffc4', label: 'Menthe'   },
    { val: 'fc909f', color: '#fc909f', label: 'Rose'     },
    { val: 'ff5c5c', color: '#ff5c5c', label: 'Rouge'    },
    { val: 'ffffb1', color: '#ffffb1', label: 'Jaune'    },
    { val: 'e6e6e6', color: '#e6e6e6', label: 'Gris'     },
    { val: '262e33', color: '#262e33', label: 'Noir'     },
    { val: 'ffffff', color: '#ffffff', label: 'Blanc'    },
  ],
  GRAPHIC_SHIRTS: [
    { val: 'pizza',        label: '🍕 Pizza'   }, { val: 'bear',    label: '🐻 Ours'    },
    { val: 'bat',          label: '🦇 Chauve-souris' }, { val: 'deer', label: '🦌 Cerf' },
    { val: 'skull',        label: '💀 Crâne'   }, { val: 'skullOutline', label: '☠️ Crâne 2' },
    { val: 'diamond',      label: '💎 Diamant' }, { val: 'hola',    label: '👋 Hola'    },
    { val: 'cumbia',       label: '🎵 Cumbia'  }, { val: 'resist',  label: '✊ Resist'  },
  ],

  // ===== PRESETS COMMUNS (graines pour tous les styles non-humains) =====
  AVATAR_PRESETS: [
    'Ryker','Jessica','Oliver','Amaya','Vivian','Mason',
    'Christopher','Andrea','Liam','Sophia','Jack','Robert',
    'Abby','Chase','Destiny','Felix','Grace','Henry',
    'Iris','Jake','Kira','Leo','Mia','Nate',
  ],

  // ===== OPTIONS ROBOT (bottts) =====
  BOTTTS_EYES: [
    { val: 'bulging',      label: 'Bombé'    }, { val: 'dizzy',       label: 'Étourdi'     },
    { val: 'eva',          label: 'Eva'      }, { val: 'frame1',      label: 'Carré 1'     },
    { val: 'frame2',       label: 'Carré 2'  }, { val: 'glow',        label: 'Brillant'    },
    { val: 'happy',        label: 'Joyeux'   }, { val: 'hearts',      label: 'Cœurs'       },
    { val: 'robocop',      label: 'RoboCop'  }, { val: 'round',       label: 'Rond'        },
    { val: 'roundFrame01', label: 'Cadre 1'  }, { val: 'roundFrame02',label: 'Cadre 2'     },
    { val: 'sensor',       label: 'Capteur'  }, { val: 'shade01',     label: 'Ombre'       },
  ],
  BOTTTS_MOUTHS: [
    { val: 'bite',    label: 'Morsure'   }, { val: 'diagram', label: 'Diagramme' },
    { val: 'grill01', label: 'Grille 1'  }, { val: 'grill02', label: 'Grille 2'  },
    { val: 'grill03', label: 'Grille 3'  }, { val: 'smile01', label: 'Sourire 1' },
    { val: 'smile02', label: 'Sourire 2' }, { val: 'square01',label: 'Carré 1'   },
    { val: 'square02',label: 'Carré 2'   },
  ],
  BOTTTS_TEXTURES: [
    { val: '',         label: 'Aucune'    }, { val: 'camo01',   label: 'Camo 1'    },
    { val: 'camo02',   label: 'Camo 2'    }, { val: 'circuits', label: 'Circuits'  },
    { val: 'dirty01',  label: 'Sale 1'    }, { val: 'dirty02',  label: 'Sale 2'    },
    { val: 'dots',     label: 'Points'    }, { val: 'grunge01', label: 'Grunge 1'  },
    { val: 'grunge02', label: 'Grunge 2'  },
  ],
  BOTTTS_FACE: [
    { val: 'round01',  label: 'Rond 1'  }, { val: 'round02',  label: 'Rond 2'  },
    { val: 'square01', label: 'Carré 1' }, { val: 'square02', label: 'Carré 2' },
    { val: 'square03', label: 'Carré 3' }, { val: 'square04', label: 'Carré 4' },
  ],
  BOTTTS_SIDES: [
    { val: 'antenna01',        label: 'Antenne 1'   }, { val: 'antenna02', label: 'Antenne 2'   },
    { val: 'cables01',         label: 'Câbles 1'    }, { val: 'cables02',  label: 'Câbles 2'    },
    { val: 'round',            label: 'Rond'        }, { val: 'square',    label: 'Carré'       },
    { val: 'squareAssymetric', label: 'Carré Asym.' },
  ],
  BOTTTS_TOP: [
    { val: 'antenna',        label: 'Antenne'         }, { val: 'antennaCrooked', label: 'Antenne Tordue'  },
    { val: 'bulb01',         label: 'Ampoule'         }, { val: 'glowingBulb01',  label: 'Ampoule Lumin. 1'},
    { val: 'glowingBulb02',  label: 'Ampoule Lumin. 2'}, { val: 'horns',          label: 'Cornes'          },
    { val: 'lights',         label: 'Lumières'        }, { val: 'pyramid',        label: 'Pyramide'        },
    { val: 'radar',          label: 'Radar'           },
  ],

  // ===== OPTIONS EMOJI (fun-emoji) =====
  EMOJI_EYES: [
    { val: 'cute',       label: 'Mignon'       }, { val: 'closed',     label: 'Fermés'       },
    { val: 'closed2',    label: 'Fermés 2'     }, { val: 'crying',     label: 'Pleurs'       },
    { val: 'glasses',    label: 'Lunettes'     }, { val: 'love',       label: 'Amour'        },
    { val: 'pissed',     label: 'Énervé'       }, { val: 'plain',      label: 'Normal'       },
    { val: 'sad',        label: 'Triste'       }, { val: 'shades',     label: 'Soleil'       },
    { val: 'sleepClose', label: 'Endormi'      }, { val: 'stars',      label: 'Étoiles'      },
    { val: 'tearDrop',   label: 'Larme'        }, { val: 'wink',       label: 'Clin d\'œil'  },
    { val: 'wink2',      label: 'Clin d\'œil 2'},
  ],
  EMOJI_MOUTHS: [
    { val: 'cute',       label: 'Mignon'       }, { val: 'drip',      label: 'Bave'         },
    { val: 'faceMask',   label: 'Masque'       }, { val: 'kissHeart', label: 'Bisou'        },
    { val: 'lilSmile',   label: 'Petit sourire'}, { val: 'pissed',    label: 'Fâché'        },
    { val: 'plain',      label: 'Neutre'       }, { val: 'sad',       label: 'Triste'       },
    { val: 'shout',      label: 'Cri'          }, { val: 'shy',       label: 'Timide'       },
    { val: 'sick',       label: 'Malade'       }, { val: 'smileLol',  label: 'LOL'          },
    { val: 'smileTeeth', label: 'Dents'        }, { val: 'tongueOut', label: 'Langue'       },
    { val: 'wideSmile',  label: 'Sourire large'},
  ],

  // ===== OPTIONS PIXEL ART =====
  PIXEL_HAIR: [
    { val: 'long01',  label: 'Long 1'   }, { val: 'long02',  label: 'Long 2'   },
    { val: 'long03',  label: 'Long 3'   }, { val: 'long04',  label: 'Long 4'   },
    { val: 'long05',  label: 'Long 5'   }, { val: 'long06',  label: 'Long 6'   },
    { val: 'long07',  label: 'Long 7'   }, { val: 'long08',  label: 'Long 8'   },
    { val: 'long09',  label: 'Long 9'   }, { val: 'long10',  label: 'Long 10'  },
    { val: 'long11',  label: 'Long 11'  }, { val: 'long12',  label: 'Long 12'  },
    { val: 'long13',  label: 'Long 13'  }, { val: 'long14',  label: 'Long 14'  },
    { val: 'long15',  label: 'Long 15'  }, { val: 'long16',  label: 'Long 16'  },
    { val: 'long17',  label: 'Long 17'  }, { val: 'long18',  label: 'Long 18'  },
    { val: 'long19',  label: 'Long 19'  }, { val: 'long20',  label: 'Long 20'  },
    { val: 'long21',  label: 'Long 21'  },
    { val: 'short01', label: 'Court 1'  }, { val: 'short02', label: 'Court 2'  },
    { val: 'short03', label: 'Court 3'  }, { val: 'short04', label: 'Court 4'  },
    { val: 'short05', label: 'Court 5'  }, { val: 'short06', label: 'Court 6'  },
    { val: 'short07', label: 'Court 7'  }, { val: 'short08', label: 'Court 8'  },
    { val: 'short09', label: 'Court 9'  }, { val: 'short10', label: 'Court 10' },
    { val: 'short11', label: 'Court 11' }, { val: 'short12', label: 'Court 12' },
    { val: 'short13', label: 'Court 13' }, { val: 'short14', label: 'Court 14' },
    { val: 'short15', label: 'Court 15' }, { val: 'short16', label: 'Court 16' },
    { val: 'short17', label: 'Court 17' }, { val: 'short18', label: 'Court 18' },
    { val: 'short19', label: 'Court 19' }, { val: 'short20', label: 'Court 20' },
    { val: 'short21', label: 'Court 21' }, { val: 'short22', label: 'Court 22' },
    { val: 'short23', label: 'Court 23' }, { val: 'short24', label: 'Court 24' },
  ],
  PIXEL_CLOTHING: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
    { val: 'variant19', label: '19' }, { val: 'variant20', label: '20' }, { val: 'variant21', label: '21' },
    { val: 'variant22', label: '22' }, { val: 'variant23', label: '23' },
  ],
  PIXEL_EYES: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
  ],
  PIXEL_MOUTH_HAPPY: [
    { val: 'happy01', label: 'S1'  }, { val: 'happy02', label: 'S2'  }, { val: 'happy03', label: 'S3'  },
    { val: 'happy04', label: 'S4'  }, { val: 'happy05', label: 'S5'  }, { val: 'happy06', label: 'S6'  },
    { val: 'happy07', label: 'S7'  }, { val: 'happy08', label: 'S8'  }, { val: 'happy09', label: 'S9'  },
    { val: 'happy10', label: 'S10' }, { val: 'happy11', label: 'S11' }, { val: 'happy12', label: 'S12' },
    { val: 'happy13', label: 'S13' },
  ],
  PIXEL_MOUTH_SAD: [
    { val: 'sad01', label: 'T1'  }, { val: 'sad02', label: 'T2'  }, { val: 'sad03', label: 'T3'  },
    { val: 'sad04', label: 'T4'  }, { val: 'sad05', label: 'T5'  }, { val: 'sad06', label: 'T6'  },
    { val: 'sad07', label: 'T7'  }, { val: 'sad08', label: 'T8'  }, { val: 'sad09', label: 'T9'  },
    { val: 'sad10', label: 'T10' },
  ],
  PIXEL_ACCESSORIES: [
    { val: 'variant01', label: '1' }, { val: 'variant02', label: '2' },
    { val: 'variant03', label: '3' }, { val: 'variant04', label: '4' },
  ],
  PIXEL_BEARD: [
    { val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' },
    { val: 'variant04', label: '4' }, { val: 'variant05', label: '5' }, { val: 'variant06', label: '6' },
    { val: 'variant07', label: '7' }, { val: 'variant08', label: '8' },
  ],
  PIXEL_GLASSES: [
    { val: 'dark01',  label: 'Sombre 1' }, { val: 'dark02',  label: 'Sombre 2' }, { val: 'dark03', label: 'Sombre 3' },
    { val: 'dark04',  label: 'Sombre 4' }, { val: 'dark05',  label: 'Sombre 5' }, { val: 'dark06', label: 'Sombre 6' },
    { val: 'dark07',  label: 'Sombre 7' },
    { val: 'light01', label: 'Claire 1' }, { val: 'light02', label: 'Claire 2' }, { val: 'light03', label: 'Claire 3' },
    { val: 'light04', label: 'Claire 4' }, { val: 'light05', label: 'Claire 5' }, { val: 'light06', label: 'Claire 6' },
    { val: 'light07', label: 'Claire 7' },
  ],
  PIXEL_HAT: [
    { val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' },
    { val: 'variant04', label: '4' }, { val: 'variant05', label: '5' }, { val: 'variant06', label: '6' },
    { val: 'variant07', label: '7' }, { val: 'variant08', label: '8' }, { val: 'variant09', label: '9' },
    { val: 'variant10', label: '10'},
  ],

  // ===== OPTIONS AVENTURIER (adventurer) =====
  ADV_EYES: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
    { val: 'variant19', label: '19' }, { val: 'variant20', label: '20' }, { val: 'variant21', label: '21' },
    { val: 'variant22', label: '22' }, { val: 'variant23', label: '23' }, { val: 'variant24', label: '24' },
    { val: 'variant25', label: '25' }, { val: 'variant26', label: '26' },
  ],
  ADV_MOUTH: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
    { val: 'variant19', label: '19' }, { val: 'variant20', label: '20' }, { val: 'variant21', label: '21' },
    { val: 'variant22', label: '22' }, { val: 'variant23', label: '23' }, { val: 'variant24', label: '24' },
    { val: 'variant25', label: '25' }, { val: 'variant26', label: '26' }, { val: 'variant27', label: '27' },
    { val: 'variant28', label: '28' }, { val: 'variant29', label: '29' }, { val: 'variant30', label: '30' },
  ],
  ADV_EARRINGS: [
    { val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' },
    { val: 'variant04', label: '4' }, { val: 'variant05', label: '5' }, { val: 'variant06', label: '6' },
  ],
  ADV_EYEBROWS: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
  ],
  ADV_GLASSES: [
    { val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' },
    { val: 'variant04', label: '4' }, { val: 'variant05', label: '5' },
  ],

  // ===== OPTIONS MYSTIQUE (lorelei) =====
  LOR_EYES: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
    { val: 'variant19', label: '19' }, { val: 'variant20', label: '20' }, { val: 'variant21', label: '21' },
    { val: 'variant22', label: '22' }, { val: 'variant23', label: '23' }, { val: 'variant24', label: '24' },
  ],
  LOR_MOUTH: [
    { val: 'happy01', label: 'S1'  }, { val: 'happy02', label: 'S2'  }, { val: 'happy03', label: 'S3'  },
    { val: 'happy04', label: 'S4'  }, { val: 'happy05', label: 'S5'  }, { val: 'happy06', label: 'S6'  },
    { val: 'happy07', label: 'S7'  }, { val: 'happy08', label: 'S8'  }, { val: 'happy09', label: 'S9'  },
    { val: 'happy10', label: 'S10' }, { val: 'happy11', label: 'S11' }, { val: 'happy12', label: 'S12' },
    { val: 'happy13', label: 'S13' }, { val: 'happy14', label: 'S14' }, { val: 'happy15', label: 'S15' },
    { val: 'happy16', label: 'S16' }, { val: 'happy17', label: 'S17' }, { val: 'happy18', label: 'S18' },
    { val: 'sad01',   label: 'T1'  }, { val: 'sad02',   label: 'T2'  }, { val: 'sad03',   label: 'T3'  },
    { val: 'sad04',   label: 'T4'  }, { val: 'sad05',   label: 'T5'  }, { val: 'sad06',   label: 'T6'  },
    { val: 'sad07',   label: 'T7'  }, { val: 'sad08',   label: 'T8'  }, { val: 'sad09',   label: 'T9'  },
  ],
  LOR_EYEBROWS: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' },
  ],
  LOR_NOSE: [
    { val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' },
    { val: 'variant04', label: '4' }, { val: 'variant05', label: '5' }, { val: 'variant06', label: '6' },
  ],
  LOR_BEARD:    [{ val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }],
  LOR_EARRINGS: [{ val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' }],
  LOR_GLASSES:  [
    { val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' },
    { val: 'variant04', label: '4' }, { val: 'variant05', label: '5' },
  ],
  LOR_HEAD: [
    { val: 'variant01', label: '1' }, { val: 'variant02', label: '2' },
    { val: 'variant03', label: '3' }, { val: 'variant04', label: '4' },
  ],

  // ===== OPTIONS GRAND SOURIRE (big-smile) =====
  BSMILE_ACCESSORIES: [
    { val: 'catEars',       label: 'Oreilles chat'  }, { val: 'glasses',      label: 'Lunettes'       },
    { val: 'sailormoonCrown',label: 'Couronne'      }, { val: 'clownNose',    label: 'Nez de clown'   },
    { val: 'sleepMask',     label: 'Masque nuit'    }, { val: 'sunglasses',   label: 'Lunettes soleil'},
    { val: 'faceMask',      label: 'Masque'         }, { val: 'mustache',     label: 'Moustache'      },
  ],
  BSMILE_EYES: [
    { val: 'normal',     label: 'Normal'   }, { val: 'cheery',     label: 'Joyeux'   },
    { val: 'winking',    label: 'Clin d\'œil'}, { val: 'sleepy',   label: '😴 Endormi'},
    { val: 'starstruck', label: '🤩 Étoilé' }, { val: 'confused',  label: 'Confus'   },
    { val: 'angry',      label: '😠 En colère'}, { val: 'sad',     label: 'Triste'   },
  ],
  BSMILE_MOUTHS: [
    { val: 'openedSmile',  label: 'Sourire'  }, { val: 'teethSmile',  label: 'Dents'    },
    { val: 'gapSmile',     label: 'Espace'   }, { val: 'kawaii',      label: 'Kawaii'   },
    { val: 'awkwardSmile', label: 'Gêné'     }, { val: 'braces',      label: 'Appareil' },
    { val: 'openSad',      label: 'Triste'   }, { val: 'unimpressed', label: 'Blasé'    },
  ],

  // ===== OPTIONS NOTIONISTE (notionists) =====
  NOTION_EYES: [
    { val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' },
    { val: 'variant04', label: '4' }, { val: 'variant05', label: '5' },
  ],
  NOTION_LIPS: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
    { val: 'variant19', label: '19' }, { val: 'variant20', label: '20' }, { val: 'variant21', label: '21' },
    { val: 'variant22', label: '22' }, { val: 'variant23', label: '23' }, { val: 'variant24', label: '24' },
    { val: 'variant25', label: '25' }, { val: 'variant26', label: '26' }, { val: 'variant27', label: '27' },
    { val: 'variant28', label: '28' }, { val: 'variant29', label: '29' }, { val: 'variant30', label: '30' },
  ],
  NOTION_BROWS: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' },
  ],
  NOTION_NOSE: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
    { val: 'variant19', label: '19' }, { val: 'variant20', label: '20' },
  ],
  NOTION_BEARD: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
  ],
  NOTION_BODY: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
    { val: 'variant19', label: '19' }, { val: 'variant20', label: '20' }, { val: 'variant21', label: '21' },
    { val: 'variant22', label: '22' }, { val: 'variant23', label: '23' }, { val: 'variant24', label: '24' },
    { val: 'variant25', label: '25' },
  ],
  NOTION_BODY_ICON: [
    { val: 'electric', label: 'Éclair' }, { val: 'saturn', label: 'Saturne' }, { val: 'galaxy', label: 'Galaxie' },
  ],
  NOTION_GESTURE: [
    { val: 'wavePointLongArms', label: 'Wave+Point' }, { val: 'waveOkLongArms', label: 'Wave+Ok'    },
    { val: 'waveLongArms',      label: 'Wave 2 bras'}, { val: 'waveLongArm',    label: 'Wave 1 bras'},
    { val: 'pointLongArm',      label: 'Pointer'    }, { val: 'okLongArm',      label: 'Ok bras'    },
    { val: 'point',             label: 'Pointer'    }, { val: 'ok',             label: 'Ok'         },
    { val: 'hand',              label: 'Main'       }, { val: 'handPhone',      label: 'Téléphone'  },
  ],
  NOTION_GLASSES: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' },
  ],

  // ===== COIFFURES PAR STYLE =====
  ADV_HAIR: [
    { val: 'long01',  label: 'Long 1'   }, { val: 'long02',  label: 'Long 2'   }, { val: 'long03',  label: 'Long 3'   },
    { val: 'long04',  label: 'Long 4'   }, { val: 'long05',  label: 'Long 5'   }, { val: 'long06',  label: 'Long 6'   },
    { val: 'long07',  label: 'Long 7'   }, { val: 'long08',  label: 'Long 8'   }, { val: 'long09',  label: 'Long 9'   },
    { val: 'long10',  label: 'Long 10'  }, { val: 'long11',  label: 'Long 11'  }, { val: 'long12',  label: 'Long 12'  },
    { val: 'long13',  label: 'Long 13'  }, { val: 'long14',  label: 'Long 14'  }, { val: 'long15',  label: 'Long 15'  },
    { val: 'long16',  label: 'Long 16'  }, { val: 'long17',  label: 'Long 17'  }, { val: 'long18',  label: 'Long 18'  },
    { val: 'long19',  label: 'Long 19'  }, { val: 'long20',  label: 'Long 20'  }, { val: 'long21',  label: 'Long 21'  },
    { val: 'long22',  label: 'Long 22'  }, { val: 'long23',  label: 'Long 23'  }, { val: 'long24',  label: 'Long 24'  },
    { val: 'long25',  label: 'Long 25'  }, { val: 'long26',  label: 'Long 26'  },
    { val: 'short01', label: 'Court 1'  }, { val: 'short02', label: 'Court 2'  }, { val: 'short03', label: 'Court 3'  },
    { val: 'short04', label: 'Court 4'  }, { val: 'short05', label: 'Court 5'  }, { val: 'short06', label: 'Court 6'  },
    { val: 'short07', label: 'Court 7'  }, { val: 'short08', label: 'Court 8'  }, { val: 'short09', label: 'Court 9'  },
    { val: 'short10', label: 'Court 10' }, { val: 'short11', label: 'Court 11' }, { val: 'short12', label: 'Court 12' },
    { val: 'short13', label: 'Court 13' }, { val: 'short14', label: 'Court 14' }, { val: 'short15', label: 'Court 15' },
    { val: 'short16', label: 'Court 16' }, { val: 'short17', label: 'Court 17' }, { val: 'short18', label: 'Court 18' },
    { val: 'short19', label: 'Court 19' },
  ],
  LOR_HAIR: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
    { val: 'variant19', label: '19' }, { val: 'variant20', label: '20' }, { val: 'variant21', label: '21' },
    { val: 'variant22', label: '22' }, { val: 'variant23', label: '23' }, { val: 'variant24', label: '24' },
    { val: 'variant25', label: '25' }, { val: 'variant26', label: '26' }, { val: 'variant27', label: '27' },
    { val: 'variant28', label: '28' }, { val: 'variant29', label: '29' }, { val: 'variant30', label: '30' },
    { val: 'variant31', label: '31' }, { val: 'variant32', label: '32' }, { val: 'variant33', label: '33' },
    { val: 'variant34', label: '34' }, { val: 'variant35', label: '35' }, { val: 'variant36', label: '36' },
    { val: 'variant37', label: '37' }, { val: 'variant38', label: '38' }, { val: 'variant39', label: '39' },
    { val: 'variant40', label: '40' }, { val: 'variant41', label: '41' }, { val: 'variant42', label: '42' },
    { val: 'variant43', label: '43' }, { val: 'variant44', label: '44' }, { val: 'variant45', label: '45' },
    { val: 'variant46', label: '46' }, { val: 'variant47', label: '47' }, { val: 'variant48', label: '48' },
  ],
  BSMILE_HAIR: [
    { val: 'shortHair',      label: 'Court'        }, { val: 'straightHair',  label: 'Lisse'        },
    { val: 'wavyBob',        label: 'Bob Ondulé'   }, { val: 'curlyBob',      label: 'Bob Bouclé'   },
    { val: 'curlyShortHair', label: 'Court Bouclé' }, { val: 'bangs',         label: 'Frange'       },
    { val: 'braids',         label: 'Tresses'      }, { val: 'bunHair',       label: 'Chignon'      },
    { val: 'froBun',         label: 'Fro Chignon'  }, { val: 'mohawk',        label: 'Mohawk'       },
    { val: 'shavedHead',     label: 'Rasé'         }, { val: 'halfShavedHead',label: 'Demi-Rasé'    },
    { val: 'bowlCutHair',    label: 'Bol'          },
  ],
  NOTION_HAIR: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
    { val: 'variant19', label: '19' }, { val: 'variant20', label: '20' }, { val: 'variant21', label: '21' },
    { val: 'variant22', label: '22' }, { val: 'variant23', label: '23' }, { val: 'variant24', label: '24' },
    { val: 'variant25', label: '25' }, { val: 'variant26', label: '26' }, { val: 'variant27', label: '27' },
    { val: 'variant28', label: '28' }, { val: 'variant29', label: '29' }, { val: 'variant30', label: '30' },
    { val: 'variant31', label: '31' }, { val: 'variant32', label: '32' }, { val: 'variant33', label: '33' },
    { val: 'variant34', label: '34' }, { val: 'variant35', label: '35' }, { val: 'variant36', label: '36' },
    { val: 'variant37', label: '37' }, { val: 'variant38', label: '38' }, { val: 'variant39', label: '39' },
    { val: 'variant40', label: '40' }, { val: 'variant41', label: '41' }, { val: 'variant42', label: '42' },
    { val: 'variant43', label: '43' }, { val: 'variant44', label: '44' }, { val: 'variant45', label: '45' },
    { val: 'variant46', label: '46' }, { val: 'variant47', label: '47' }, { val: 'variant48', label: '48' },
    { val: 'variant49', label: '49' }, { val: 'variant50', label: '50' }, { val: 'variant51', label: '51' },
    { val: 'variant52', label: '52' }, { val: 'variant53', label: '53' }, { val: 'variant54', label: '54' },
    { val: 'variant55', label: '55' }, { val: 'variant56', label: '56' }, { val: 'variant57', label: '57' },
    { val: 'variant58', label: '58' }, { val: 'variant59', label: '59' }, { val: 'variant60', label: '60' },
    { val: 'variant61', label: '61' }, { val: 'variant62', label: '62' }, { val: 'variant63', label: '63' },
    { val: 'hat', label: 'Chapeau' },
  ],

  // ===== OPTIONS TOONHEAD =====
  TOONHEAD_HAIR: [
    { val: 'sideComed', label: 'Plaqué'  }, { val: 'undercut', label: 'Undercut' },
    { val: 'spiky',     label: 'Piquant' }, { val: 'bun',      label: 'Chignon'  },
  ],
  TOONHEAD_REAR_HAIR: [
    { val: 'longStraight', label: 'Long Droit'   }, { val: 'longWavy',     label: 'Long Ondulé' },
    { val: 'shoulderHigh', label: 'Épaules'      }, { val: 'neckHigh',     label: 'Nuque'       },
  ],
  TOONHEAD_EYES: [
    { val: 'happy',  label: 'Heureux'      }, { val: 'wide',   label: 'Écarquillés'  },
    { val: 'bow',    label: 'Courbés'      }, { val: 'humble', label: 'Doux'         },
    { val: 'wink',   label: 'Clin d\'œil' },
  ],
  TOONHEAD_EYEBROWS: [
    { val: 'raised',  label: 'Levés'     }, { val: 'angry',   label: 'En colère' },
    { val: 'happy',   label: 'Heureux'   }, { val: 'sad',     label: 'Tristes'   },
    { val: 'neutral', label: 'Neutres'   },
  ],
  TOONHEAD_MOUTH: [
    { val: 'laugh', label: 'Rire'           }, { val: 'angry', label: 'En colère'    },
    { val: 'agape', label: 'Bouche ouverte' }, { val: 'smile', label: 'Sourire'      },
    { val: 'sad',   label: 'Triste'         },
  ],
  TOONHEAD_BEARD: [
    { val: 'moustacheTwirl', label: 'Moustache'       }, { val: 'fullBeard',     label: 'Barbe Complète'   },
    { val: 'chin',           label: 'Bouc'            }, { val: 'chinMoustache', label: 'Bouc+Moustache'   },
    { val: 'longBeard',      label: 'Longue Barbe'    },
  ],
  TOONHEAD_CLOTHES: [
    { val: 'turtleNeck', label: 'Col Roulé'      }, { val: 'openJacket', label: 'Veste Ouverte' },
    { val: 'dress',      label: 'Robe'           }, { val: 'shirt',      label: 'Chemise'       },
    { val: 'tShirt',     label: 'T-Shirt'        },
  ],

  // ===== OPTIONS DYLAN =====
  DYLAN_HAIR: [
    { val: 'plain',      label: 'Lisse'       }, { val: 'wavy',      label: 'Ondulé'     },
    { val: 'shortCurls', label: 'Bouclé Ct.'  }, { val: 'parting',   label: 'Raie'       },
    { val: 'spiky',      label: 'Piquant'     }, { val: 'roundBob',  label: 'Bob Rond'   },
    { val: 'longCurls',  label: 'Bouclé Long' }, { val: 'buns',      label: 'Chignons'   },
    { val: 'bangs',      label: 'Frange'      }, { val: 'fluffy',    label: 'Bouffant'   },
    { val: 'flatTop',    label: 'Flat Top'    }, { val: 'shaggy',    label: 'Ébouriffé'  },
  ],
  DYLAN_MOOD: [
    { val: 'happy',      label: 'Heureux'        }, { val: 'superHappy', label: 'Super Heureux'   },
    { val: 'neutral',    label: 'Neutre'         }, { val: 'hopeful',    label: 'Plein d\'espoir' },
    { val: 'confused',   label: 'Confus'         }, { val: 'sad',        label: 'Triste'          },
    { val: 'angry',      label: 'En colère'      },
  ],

  // ===== OPTIONS CROODLES =====
  CROODLES_TOP: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
    { val: 'variant19', label: '19' }, { val: 'variant20', label: '20' }, { val: 'variant21', label: '21' },
    { val: 'variant22', label: '22' }, { val: 'variant23', label: '23' }, { val: 'variant24', label: '24' },
    { val: 'variant25', label: '25' }, { val: 'variant26', label: '26' }, { val: 'variant27', label: '27' },
    { val: 'variant28', label: '28' }, { val: 'variant29', label: '29' },
  ],
  CROODLES_TOP_COLORS: [
    { val: 'ffc700', color: '#ffc700', label: 'Jaune'  }, { val: '9747ff', color: '#9747ff', label: 'Violet' },
    { val: 'f24e1e', color: '#f24e1e', label: 'Orange' }, { val: '699bf7', color: '#699bf7', label: 'Bleu'   },
    { val: '0fa958', color: '#0fa958', label: 'Vert'   }, { val: '000000', color: '#000000', label: 'Noir'   },
  ],
  CROODLES_FACE: [
    { val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' },
    { val: 'variant04', label: '4' }, { val: 'variant05', label: '5' }, { val: 'variant06', label: '6' },
    { val: 'variant07', label: '7' }, { val: 'variant08', label: '8' },
  ],
  CROODLES_EYES: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' },
  ],
  CROODLES_MOUTH: [
    { val: 'variant01', label: '1'  }, { val: 'variant02', label: '2'  }, { val: 'variant03', label: '3'  },
    { val: 'variant04', label: '4'  }, { val: 'variant05', label: '5'  }, { val: 'variant06', label: '6'  },
    { val: 'variant07', label: '7'  }, { val: 'variant08', label: '8'  }, { val: 'variant09', label: '9'  },
    { val: 'variant10', label: '10' }, { val: 'variant11', label: '11' }, { val: 'variant12', label: '12' },
    { val: 'variant13', label: '13' }, { val: 'variant14', label: '14' }, { val: 'variant15', label: '15' },
    { val: 'variant16', label: '16' }, { val: 'variant17', label: '17' }, { val: 'variant18', label: '18' },
  ],
  CROODLES_BEARD:    [{ val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' }, { val: 'variant04', label: '4' }, { val: 'variant05', label: '5' }],
  CROODLES_MUSTACHE: [{ val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' }, { val: 'variant04', label: '4' }],
  CROODLES_NOSE:     [{ val: 'variant01', label: '1' }, { val: 'variant02', label: '2' }, { val: 'variant03', label: '3' }, { val: 'variant04', label: '4' }, { val: 'variant05', label: '5' }, { val: 'variant06', label: '6' }, { val: 'variant07', label: '7' }, { val: 'variant08', label: '8' }, { val: 'variant09', label: '9' }],

  // ===== AVATAR PAR DÉFAUT =====
  DEFAULT_AVATAR: {
    style: 'avataaars',
    bgColor: 'b6e3f4',
    seed: 'geolearn42',
    // Avataaars
    top: 'shortCurly', hairColor: '2c1b18', hatColor: '3c4f5c',
    skinColor: 'edb98a', eyes: 'default', eyebrows: 'defaultNatural',
    mouth: 'smile', facialHair: 'blank', facialHairColor: '2c1b18',
    accessories: 'blank', accessoriesColor: '262e33',
    clothing: 'hoodie', clothingColor: '9287ff', clothingGraphic: 'pizza',
    // Bottts
    botttsEyes: 'robocop', botttsMouth: 'smile01', botttsTexture: '', botttsFace: '', botttsSides: '', botttsTop: '',
    // Fun emoji
    emojiEyes: 'wink', emojiMouth: 'cute',
    // Pixel Art
    pixelHair: '', pixelHairColor: '', pixelSkinColor: '', pixelClothing: '',
    pixelEyes: '', pixelMouthHappy: '', pixelMouthSad: '', pixelAccessories: '', pixelBeard: '', pixelGlasses: '', pixelHat: '',
    // Aventurier
    advSkinColor: '', advHair: '', advHairColor: '', advEyes: '', advMouth: '',
    advEarrings: '', advEyebrows: '', advGlasses: '',
    // Mystique (lorelei)
    lorSkinColor: '', lorHair: '', lorEyes: '', lorMouth: '', lorHairColor: '',
    lorBeard: '', lorEarrings: '', lorEyebrows: '', lorGlasses: '', lorHead: '', lorNose: '',
    // Grand Sourire (big-smile)
    bsmileSkinColor: '', bsmileHair: '', bsmileEyes: '', bsmileMouth: '', bsmileHairColor: '', bsmileAccessories: '',
    // Notioniste (notionists)
    notionSkinColor: '', notionHair: '', notionHairColor: '', notionEyes: '', notionLips: '',
    notionBeard: '', notionBody: '', notionBodyIcon: '', notionBrows: '', notionGesture: '', notionGlasses: '', notionNose: '',
    // Toonhead
    toonheadSkinColor: '', toonheadHairColor: '', toonheadClothesColor: '',
    toonheadHair: '', toonheadRearHair: '', toonheadEyes: '', toonheadEyebrows: '', toonheadMouth: '', toonheadBeard: '', toonheadClothes: '',
    // Dylan
    dylanSkinColor: '', dylanHair: '', dylanHairColor: '', dylanMood: '',
    // Croodles
    croodlesTop: '', croodlesTopColor: '', croodlesFace: '', croodlesEyes: '', croodlesMouth: '',
    croodlesBeard: '', croodlesMustache: '', croodlesNose: '',
    // Bottts Neutre
    btntEyes: '', btntMouth: '',
  },

  // ===== STORAGE =====
  load() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null'); } catch(e) { return null; }
  },
  save(p) {
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(p)); } catch(e) {}
  },
  get() { return this.load(); },

  defaultProfile(name, isGuest) {
    return { name: name || 'Invité', isGuest: !!isGuest, nameColor: '', avatar: { ...this.DEFAULT_AVATAR } };
  },

  migrateAvatar(av) {
    if (!av) return { ...this.DEFAULT_AVATAR };
    // Anciens formats (micah seed ou avataaars sans champ style)
    if (!av.style) {
      const base = { ...this.DEFAULT_AVATAR };
      // Récupérer ce qui est encore valide
      const keep = ['bgColor','top','hairColor','skinColor','eyes','mouth','clothing','clothingColor'];
      keep.forEach(k => { if (av[k]) base[k] = av[k]; });
      return base;
    }
    // Valeurs renommées/supprimées dans DiceBear v9
    if (av.eyes === 'close')  av.eyes = 'closed';
    if (av.eyes === 'dizzy')  av.eyes = 'default';
    if (av.top  === 'winterHat01') av.top = 'winterHat1';
    if (av.top  === 'eyepatch' || av.top === 'noHair') av.top = 'shortFlat';
    if (av.clothingGraphic === 'selena') av.clothingGraphic = 'skullOutline';
    // Bottts
    if (av.botttsEyes === 'bulge')   av.botttsEyes = 'bulging';
    if (av.botttsEyes === 'frame01') av.botttsEyes = 'frame1';
    if (av.botttsEyes === 'frame02') av.botttsEyes = 'frame2';
    if (av.botttsEyes === 'shade02') av.botttsEyes = 'shade01';
    if (av.botttsTexture === 'forest') av.botttsTexture = 'dots';
    // Fun-emoji
    if (av.emojiEyes === 'cheery') av.emojiEyes = 'cute';
    if (av.emojiEyes === 'sleepy') av.emojiEyes = 'sleepClose';
    if (av.emojiMouth === 'drool')   av.emojiMouth = 'drip';
    if (av.emojiMouth === 'pensive') av.emojiMouth = 'sad';
    // Adventurer
    if (av.advHair === 'pixie') av.advHair = 'long01';
    // Lorelei (mouth was all wrong — variant0x → happy0x)
    if (av.lorMouth && av.lorMouth.startsWith('variant')) av.lorMouth = 'happy01';
    // Big-smile (eyes, mouth & hair were all wrong)
    if (av.bsmileEyes  && av.bsmileEyes.startsWith('variant'))  av.bsmileEyes  = 'normal';
    if (av.bsmileMouth && av.bsmileMouth.startsWith('variant')) av.bsmileMouth = 'openedSmile';
    if (av.bsmileHair  && av.bsmileHair.startsWith('variant'))  av.bsmileHair  = 'shortHair';
    // Notionists (only 5 eyes variants exist)
    if (av.notionEyes && parseInt(av.notionEyes.replace('variant','')) > 5) av.notionEyes = 'variant01';
    // Toon-head (old variant0x values — valid values are named, not numbered)
    const toonFields = ['toonheadHair','toonheadRearHair','toonheadEyes','toonheadEyebrows','toonheadMouth','toonheadBeard','toonheadClothes'];
    toonFields.forEach(k => { if (av[k] && av[k].startsWith('variant')) av[k] = ''; });
    // Bottts-neutral (shares same invalid values as bottts)
    if (av.btntEyes === 'bulge')   av.btntEyes = 'bulging';
    if (av.btntEyes === 'frame01') av.btntEyes = 'frame1';
    if (av.btntEyes === 'frame02') av.btntEyes = 'frame2';
    if (av.btntEyes === 'shade02') av.btntEyes = 'shade01';
    return av;
  },

  // ===== GÉNÉRATION D'URL PAR STYLE =====
  avatarUrl(av, size, scale) {
    const s   = size  || 80;
    const sc  = scale || 100;
    const bg  = av.bgColor && av.bgColor !== 'transparent' ? `backgroundColor=${av.bgColor}&` : '';
    const base = (style, params) => `https://api.dicebear.com/9.x/${style}/svg?${bg}size=${s}&${params}`;

    switch (av.style || 'avataaars') {

      case 'bottts': {
        let p = `seed=${av.seed || 'r0b0t'}`;
        if (av.botttsEyes)    p += `&eyes[]=${av.botttsEyes}`;
        if (av.botttsMouth)   p += `&mouth[]=${av.botttsMouth}`;
        if (av.botttsFace)    p += `&face[]=${av.botttsFace}`;
        if (av.botttsSides)   p += `&sides[]=${av.botttsSides}`;
        if (av.botttsTop)     p += `&top[]=${av.botttsTop}`;
        if (av.botttsTexture) p += `&texture[]=${av.botttsTexture}&textureProbability=100`;
        else                  p += `&textureProbability=0`;
        return base('bottts', p);
      }

      case 'fun-emoji': {
        let p = `seed=${av.seed || 'emoji99'}`;
        if (av.emojiEyes)  p += `&eyes[]=${av.emojiEyes}`;
        if (av.emojiMouth) p += `&mouth[]=${av.emojiMouth}`;
        return base('fun-emoji', p);
      }

      case 'pixel-art': {
        let p = `seed=${av.seed || 'pix3l'}`;
        if (av.pixelHair)        p += `&hair[]=${av.pixelHair}`;
        if (av.pixelHairColor)   p += `&hairColor[]=${av.pixelHairColor}`;
        if (av.pixelSkinColor)   p += `&skinColor[]=${av.pixelSkinColor}`;
        if (av.pixelClothing)    p += `&clothing[]=${av.pixelClothing}`;
        if (av.pixelEyes)        p += `&eyes[]=${av.pixelEyes}`;
        const pixelMouth = av.pixelMouthHappy || av.pixelMouthSad;
        if (pixelMouth)          p += `&mouth[]=${pixelMouth}`;
        if (av.pixelAccessories) p += `&accessories[]=${av.pixelAccessories}&accessoriesProbability=100`;
        else                     p += `&accessoriesProbability=0`;
        if (av.pixelBeard)       p += `&beard[]=${av.pixelBeard}&beardProbability=100`;
        else                     p += `&beardProbability=0`;
        if (av.pixelGlasses)     p += `&glasses[]=${av.pixelGlasses}&glassesProbability=100`;
        else                     p += `&glassesProbability=0`;
        if (av.pixelHat)         p += `&hat[]=${av.pixelHat}&hatProbability=100`;
        else                     p += `&hatProbability=0`;
        return base('pixel-art', p);
      }

      case 'adventurer': {
        let p = `seed=${av.seed || 'adv3nt'}`;
        if (av.advSkinColor)  p += `&skinColor[]=${av.advSkinColor}`;
        if (av.advHair)       p += `&hair[]=${av.advHair}`;
        if (av.advHairColor)  p += `&hairColor[]=${av.advHairColor}`;
        if (av.advEyes)       p += `&eyes[]=${av.advEyes}`;
        if (av.advMouth)      p += `&mouth[]=${av.advMouth}`;
        if (av.advEyebrows)   p += `&eyebrows[]=${av.advEyebrows}`;
        if (av.advEarrings)   p += `&earrings[]=${av.advEarrings}&earringsProbability=100`;
        else                  p += `&earringsProbability=0`;
        if (av.advGlasses)    p += `&glasses[]=${av.advGlasses}&glassesProbability=100`;
        else                  p += `&glassesProbability=0`;
        return base('adventurer', p);
      }

      case 'lorelei': {
        let p = `seed=${av.seed || 'l0r3l31'}`;
        if (av.lorSkinColor)  p += `&skinColor[]=${av.lorSkinColor}`;
        if (av.lorHair)       p += `&hair[]=${av.lorHair}`;
        if (av.lorEyes)       p += `&eyes[]=${av.lorEyes}`;
        if (av.lorMouth)      p += `&mouth[]=${av.lorMouth}`;
        if (av.lorHairColor)  p += `&hairColor[]=${av.lorHairColor}`;
        if (av.lorEyebrows)   p += `&eyebrows[]=${av.lorEyebrows}`;
        if (av.lorHead)       p += `&head[]=${av.lorHead}`;
        if (av.lorNose)       p += `&nose[]=${av.lorNose}`;
        if (av.lorBeard)      p += `&beard[]=${av.lorBeard}&beardProbability=100`;
        else                  p += `&beardProbability=0`;
        if (av.lorEarrings)   p += `&earrings[]=${av.lorEarrings}&earringsProbability=100`;
        else                  p += `&earringsProbability=0`;
        if (av.lorGlasses)    p += `&glasses[]=${av.lorGlasses}&glassesProbability=100`;
        else                  p += `&glassesProbability=0`;
        return base('lorelei', p);
      }

      case 'big-smile': {
        let p = `seed=${av.seed || 'bigsmile'}`;
        if (av.bsmileSkinColor)    p += `&skinColor[]=${av.bsmileSkinColor}`;
        if (av.bsmileHair)         p += `&hair[]=${av.bsmileHair}`;
        if (av.bsmileEyes)         p += `&eyes[]=${av.bsmileEyes}`;
        if (av.bsmileMouth)        p += `&mouth[]=${av.bsmileMouth}`;
        if (av.bsmileHairColor)    p += `&hairColor[]=${av.bsmileHairColor}`;
        if (av.bsmileAccessories)  p += `&accessories[]=${av.bsmileAccessories}&accessoriesProbability=100`;
        else                       p += `&accessoriesProbability=0`;
        return base('big-smile', p);
      }

      case 'notionists': {
        let p = `seed=${av.seed || 'n0ti0n'}`;
        if (av.notionSkinColor)  p += `&skinColor[]=${av.notionSkinColor}`;
        if (av.notionHair)       p += `&hair[]=${av.notionHair}`;
        if (av.notionHairColor)  p += `&hairColor[]=${av.notionHairColor}`;
        if (av.notionEyes)       p += `&eyes[]=${av.notionEyes}`;
        if (av.notionLips)       p += `&lips[]=${av.notionLips}`;
        if (av.notionBrows)      p += `&brows[]=${av.notionBrows}`;
        if (av.notionNose)       p += `&nose[]=${av.notionNose}`;
        if (av.notionBody)       p += `&body[]=${av.notionBody}`;
        if (av.notionBeard)      p += `&beard[]=${av.notionBeard}&beardProbability=100`;
        else                     p += `&beardProbability=0`;
        if (av.notionBodyIcon)   p += `&bodyIcon[]=${av.notionBodyIcon}&bodyIconProbability=100`;
        else                     p += `&bodyIconProbability=0`;
        if (av.notionGesture)    p += `&gesture[]=${av.notionGesture}&gestureProbability=100`;
        else                     p += `&gestureProbability=0`;
        if (av.notionGlasses)    p += `&glasses[]=${av.notionGlasses}&glassesProbability=100`;
        else                     p += `&glassesProbability=0`;
        return base('notionists', p);
      }

      case 'toon-head': {
        let p = `seed=${av.seed || 'toon1'}`;
        if (av.toonheadSkinColor)  p += `&skinColor[]=${av.toonheadSkinColor}`;
        if (av.toonheadHairColor)  p += `&hairColor[]=${av.toonheadHairColor}`;
        if (av.toonheadEyes)       p += `&eyes[]=${av.toonheadEyes}`;
        if (av.toonheadEyebrows)   p += `&eyebrows[]=${av.toonheadEyebrows}`;
        if (av.toonheadMouth)      p += `&mouth[]=${av.toonheadMouth}`;
        if (av.toonheadClothes)    p += `&clothes[]=${av.toonheadClothes}`;
        if (av.toonheadClothesColor) p += `&clothesColor[]=${av.toonheadClothesColor}`;
        if (av.toonheadHair)     p += `&hair[]=${av.toonheadHair}&hairProbability=100`;
        if (av.toonheadRearHair) p += `&rearHair[]=${av.toonheadRearHair}&rearHairProbability=100`;
        if (av.toonheadBeard)    p += `&beard[]=${av.toonheadBeard}&beardProbability=100`;
        return base('toon-head', p);
      }

      case 'dylan': {
        let p = `seed=${av.seed || 'dylan1'}`;
        if (av.dylanSkinColor)  p += `&skinColor[]=${av.dylanSkinColor}`;
        if (av.dylanHair)       p += `&hair[]=${av.dylanHair}`;
        if (av.dylanHairColor)  p += `&hairColor[]=${av.dylanHairColor}`;
        if (av.dylanMood)       p += `&mood[]=${av.dylanMood}`;
        return base('dylan', p);
      }

      case 'croodles': {
        let p = `seed=${av.seed || 'croodle1'}`;
        if (av.croodlesTop)      p += `&top[]=${av.croodlesTop}`;
        if (av.croodlesTopColor) p += `&topColor=${av.croodlesTopColor}`;
        if (av.croodlesFace)     p += `&face[]=${av.croodlesFace}`;
        if (av.croodlesEyes)     p += `&eyes[]=${av.croodlesEyes}`;
        if (av.croodlesMouth)    p += `&mouth[]=${av.croodlesMouth}`;
        if (av.croodlesNose)     p += `&nose[]=${av.croodlesNose}`;
        if (av.croodlesBeard)    p += `&beard[]=${av.croodlesBeard}&beardProbability=100`;
        else                     p += `&beardProbability=0`;
        if (av.croodlesMustache) p += `&mustache[]=${av.croodlesMustache}&mustacheProbability=100`;
        else                     p += `&mustacheProbability=0`;
        return base('croodles', p);
      }

      case 'bottts-neutral': {
        let p = `seed=${av.seed || 'btnt1'}`;
        if (av.btntEyes)    p += `&eyes[]=${av.btntEyes}`;
        if (av.btntMouth)   p += `&mouth[]=${av.btntMouth}`;
        return base('bottts-neutral', p);
      }

      default: { // avataaars
        const a = { ...this.DEFAULT_AVATAR, ...av };
        const parts = [
          `seed=geolearn`, `size=${s}`, `scale=${sc}`,
          `skinColor[]=${a.skinColor}`,
          `top[]=${a.top}`, `hairColor[]=${a.hairColor}`, `hatColor[]=${a.hatColor}`,
          `eyes[]=${a.eyes}`, `eyebrows[]=${a.eyebrows}`, `mouth[]=${a.mouth}`,
          `clothing[]=${a.clothing}`, `clothingColor[]=${a.clothingColor}`,
          `clothingGraphic[]=${a.clothingGraphic}`,
        ];
        if (av.bgColor && av.bgColor !== 'transparent') parts.push(`backgroundColor=${av.bgColor}`);
        if (a.facialHair && a.facialHair !== 'blank') {
          parts.push(`facialHair[]=${a.facialHair}`, `facialHairProbability=100`, `facialHairColor[]=${a.facialHairColor}`);
        } else {
          parts.push(`facialHairProbability=0`);
        }
        if (a.accessories && a.accessories !== 'blank') {
          parts.push(`accessories[]=${a.accessories}`, `accessoriesProbability=100`, `accessoriesColor[]=${a.accessoriesColor}`);
        } else {
          parts.push(`accessoriesProbability=0`);
        }
        return `https://api.dicebear.com/9.x/avataaars/svg?${parts.join('&')}`;
      }
    }
  },

  // Preview d'une option spécifique dans le style courant
  previewUrl(feature, value, size, baseAv) {
    return this.avatarUrl({ ...(baseAv || this.DEFAULT_AVATAR), [feature]: value }, size || 80, 100);
  },

  // URL zoomée pour la navbar (zoom x1.8 sur le haut)
  navbarUrl(av) { return this.avatarUrl(av, 32); },

  // Retry automatique si une image DiceBear échoue à charger (5 tentatives, délai croissant)
  _imgRetry(img) {
    const n = +(img.dataset.retries || 0);
    if (n >= 5) return;
    img.dataset.retries = n + 1;
    // Stocker l'URL d'origine (sans cache-buster) au premier retry
    if (!img.dataset.origSrc) img.dataset.origSrc = img.src.replace(/[&?]_r=\d+/, '');
    setTimeout(() => {
      const base = img.dataset.origSrc;
      const sep = base.includes('?') ? '&' : '?';
      img.src = base + sep + '_r=' + Date.now();
    }, 800 * (n + 1));
  },

  // ===== WELCOME MODAL =====
  showWelcomeModal(onDone) {
    const self = this;
    const overlay = document.createElement('div');
    overlay.className = 'profile-modal-overlay';
    overlay.innerHTML = `
      <div class="profile-modal">
        <div class="profile-modal-globe">🌍</div>
        <h2 class="profile-modal-title">${self._t('profile.welcome.title')}</h2>
        <p class="profile-modal-subtitle">${self._t('profile.welcome.subtitle')}</p>
        <div class="rank-frame-wrap rank-frame--bronze" style="margin: 0 auto 1.4rem;">
          <div class="profile-modal-avatar-wrap">
            <img id="welcomeAvatarImg" src="${self.avatarUrl(self.DEFAULT_AVATAR, 100)}"
              alt="Avatar" width="100" height="100">
          </div>
        </div>
        <input class="profile-modal-input" id="welcomeNameInput"
          type="text" placeholder="${self._t('profile.welcome.placeholder')}" maxlength="20" autocomplete="off">
        <button class="btn btn-primary profile-modal-btn" id="welcomeStartBtn">${self._t('profile.welcome.start')}</button>
        <button class="profile-modal-guest" id="welcomeGuestBtn">${self._t('profile.welcome.guest')}</button>
      </div>
    `;
    document.body.appendChild(overlay);
    const nameInput = overlay.querySelector('#welcomeNameInput');
    nameInput.addEventListener('input', () => { nameInput.style.borderColor = ''; });
    nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') overlay.querySelector('#welcomeStartBtn').click(); });
    overlay.querySelector('#welcomeStartBtn').addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); nameInput.style.borderColor = 'var(--error)'; return; }
      const profile = self.defaultProfile(name, false);
      self.save(profile);
      if (window.GL && GL.Auth) GL.Auth.onProfileNameSet(name);
      self._closeModal(overlay, () => {
        self.updateNavAvatar(profile);
        if (window.location.hash === '#/profil') self.render(document.getElementById('app'));
        onDone && onDone(profile);
      });
    });
    overlay.querySelector('#welcomeGuestBtn').addEventListener('click', () => {
      const profile = self.defaultProfile('Invité', true);
      self.save(profile);
      self._closeModal(overlay, () => { self.updateNavAvatar(profile); onDone && onDone(profile); });
    });
    requestAnimationFrame(() => overlay.classList.add('profile-modal-in'));
    setTimeout(() => nameInput.focus(), 150);
  },

  _closeModal(overlay, cb) {
    overlay.classList.remove('profile-modal-in');
    overlay.classList.add('profile-modal-out');
    setTimeout(() => { overlay.remove(); cb && cb(); }, 350);
  },

  // ===== INIT =====
  init(onReady) {
    let profile = this.get();
    if (!profile) {
      setTimeout(() => this.showWelcomeModal(onReady), 750);
    } else {
      profile.avatar = this.migrateAvatar(profile.avatar);
      this.save(profile);
      this.updateNavAvatar(profile);
      onReady && onReady(profile);
    }
  },

  updateNavAvatar(profile) {
    const btn = document.getElementById('navProfileBtn');
    if (!btn) return;
    btn.style.display = '';
    const url = this.navbarUrl(profile.avatar);
    const displayName = profile.isGuest ? 'Invité' : profile.name;
    const xp = (GL.UI ? GL.UI.getStats().rankedXP : 0) || 0;
    const rankEntry = (GL.RankBadges ? [...GL.RankBadges.RANKS].reverse().find(r => xp >= r.min) : null) || { key: 'bronze' };
    const rankKey = rankEntry.key || 'bronze';
    const activeTitle = GL.Achievements ? GL.Achievements.getActiveTitle() : null;
    const navTitleHtml = (() => {
      if (!activeTitle) return '';
      const text = activeTitle.tier === 5 ? `🌟 ${GL.Achievements._achTitle(activeTitle)}` : GL.Achievements._achTitle(activeTitle);
      const cls = activeTitle.tier === 5 ? 'ach-title-ultimate'
        : ['', 'ach-title-plastic', 'ach-title-bronze', 'ach-title-silver', 'ach-title-gold'][activeTitle.tier] || '';
      return `<span class="nav-avatar-title-text ${cls}">${text}</span>`;
    })();
    btn.innerHTML = `
      <span class="nav-rank-frame nav-rank-frame--${rankKey}">
        <img src="${url}" alt="${displayName}" class="nav-avatar-img" width="32" height="32"
          onerror="GL.Profile._imgRetry(this)">
      </span>
      <span class="nav-avatar-info">
        <span class="nav-avatar-name" title="${displayName}"${profile.nameColor ? ` style="color:${profile.nameColor}"` : ''}>${displayName}</span>
        ${navTitleHtml}
      </span>
    `;
  },

  // ===== PAGE PROFIL =====
  render(container) {
    const self = this;
    let profile = self.get() || self.defaultProfile('Invité', true);
    profile.avatar = self.migrateAvatar(profile.avatar);
    const displayName = profile.isGuest ? 'Invité' : (profile.name || 'Invité');

    // ── Helpers ──────────────────────────────────────────────────────────
    const previewGrid = (feature, options, current, baseAv) => `
      <div class="cb-option-grid">
        ${options.map(o => `
          <button class="cb-option-btn ${current === o.val ? 'active' : ''}"
            data-feature="${feature}" data-val="${o.val}" title="${o.label}">
            <div class="cb-option-img-wrap">
              <img src="${self.previewUrl(feature, o.val, 80, baseAv)}"
                alt="" width="80" height="80" loading="eager"
                onerror="GL.Profile._imgRetry(this)">
              ${current === o.val ? '<span class="cb-check">✓</span>' : ''}
            </div>
            <span>${o.label}</span>
          </button>
        `).join('')}
      </div>`;

    const colorGrid = (feature, colors, current) => `
      <div class="cb-color-grid">
        ${colors.map(c => `
          <button class="cb-color-swatch ${current === c.val ? 'active' : ''}"
            data-feature="${feature}" data-val="${c.val}"
            style="background:${c.color === 'transparent' ? 'repeating-conic-gradient(#555 0% 25%, #333 0% 50%) 0 0/10px 10px' : c.color};"
            title="${c.label}">
            ${current === c.val ? '✓' : ''}
          </button>
        `).join('')}
      </div>`;

    const presetGrid = (styleId, title) => {
      const items = self.AVATAR_PRESETS.map(seed => {
        const isActive = av.seed === seed;
        const url = `https://api.dicebear.com/9.x/${styleId}/svg?seed=${seed}&size=80`;
        return `<button class="cb-option-btn ${isActive ? 'active' : ''}"
          data-feature="seed" data-val="${seed}" title="${seed}">
          <div class="cb-option-img-wrap">
            <img src="${url}" alt="${seed}" width="80" height="80" loading="eager"
              onerror="GL.Profile._imgRetry(this)">
            ${isActive ? '<span class="cb-check">✓</span>' : ''}
          </div>
          <span>${seed}</span>
        </button>`;
      }).join('');
      return `<details class="cb-section" open>
        <summary class="cb-section-title">${title}</summary>
        <div class="cb-section-body"><div class="cb-option-grid">${items}</div></div>
      </details>`;
    };

    const topGroupBtns = (group, label) => {
      const items = self.TOPS.filter(t => t.group === group);
      return `<div class="cb-group-label">${label}</div>${previewGrid('top', items, profile.avatar.top)}`;
    };

    // ── Options par style ─────────────────────────────────────────────────
    const av = profile.avatar;
    const styleId = av.style || 'avataaars';

    // ── Rang actuel ───────────────────────────────────────────────────────
    const _xp = (GL.UI ? GL.UI.getStats().rankedXP : 0) || 0;
    const _rankEntry = (GL.RankBadges ? [...GL.RankBadges.RANKS].reverse().find(r => _xp >= r.min) : null) || { key: 'bronze', name: 'Bronze', color: '#cd7f32' };
    const _rankKey = _rankEntry.key || 'bronze';
    const _rankTiers = GL.UI ? GL.UI.RANK_TIERS : [];
    const _rankName = _rankEntry.name;

    const styleOptionsHtml = () => {
      switch (styleId) {

        case 'avataaars': return `
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.skin')}</summary>
            <div class="cb-section-body">${colorGrid('skinColor', self.SKIN_COLORS, av.skinColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.hair_hats')}</summary>
            <div class="cb-section-body">
              ${topGroupBtns('long',    self._t('profile.group.long_hair'))}
              ${topGroupBtns('short',   self._t('profile.group.short_hair'))}
              ${topGroupBtns('hat',     self._t('profile.group.hats'))}
              ${topGroupBtns('special', self._t('profile.group.special'))}
              <div class="cb-group-label" style="margin-top:1rem;">${self._t('profile.group.hair_color')}</div>
              ${colorGrid('hairColor', self.HAIR_COLORS, av.hairColor)}
              <div class="cb-group-label" style="margin-top:.75rem;">${self._t('profile.group.hat_color')}</div>
              ${colorGrid('hatColor', self.HAT_COLORS, av.hatColor)}
            </div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.eyes_brows')}</summary>
            <div class="cb-section-body">
              <div class="cb-group-label">${self._t('profile.group.eyes')}</div>
              ${previewGrid('eyes', self.EYES, av.eyes)}
              <div class="cb-group-label" style="margin-top:.75rem;">${self._t('profile.group.eyebrows')}</div>
              ${previewGrid('eyebrows', self.EYEBROWS, av.eyebrows)}
            </div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.mouth')}</summary>
            <div class="cb-section-body">${previewGrid('mouth', self.MOUTHS, av.mouth)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.facial_hair')}</summary>
            <div class="cb-section-body">
              ${previewGrid('facialHair', self.FACIAL_HAIR, av.facialHair)}
              <div class="cb-group-label" style="margin-top:.75rem;">${self._t('profile.group.color')}</div>
              ${colorGrid('facialHairColor', self.FACIAL_HAIR_COLORS, av.facialHairColor)}
            </div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.accessories')}</summary>
            <div class="cb-section-body">
              ${previewGrid('accessories', self.ACCESSORIES, av.accessories)}
              <div class="cb-group-label" style="margin-top:.75rem;">${self._t('profile.group.frame_color')}</div>
              ${colorGrid('accessoriesColor', self.ACCESSORIES_COLORS, av.accessoriesColor)}
            </div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.clothing')}</summary>
            <div class="cb-section-body">
              ${previewGrid('clothing', self.CLOTHING, av.clothing)}
              <div class="cb-group-label" style="margin-top:.75rem;">${self._t('profile.group.clothing_color')}</div>
              ${colorGrid('clothingColor', self.CLOTHING_COLORS, av.clothingColor)}
              <div class="cb-group-label" style="margin-top:.75rem;">${self._t('profile.group.graphic')}</div>
              ${previewGrid('clothingGraphic', self.GRAPHIC_SHIRTS, av.clothingGraphic)}
            </div>
          </details>`;

        case 'bottts': return `
          ${presetGrid('bottts', self._t('profile.preset.robot'))}
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.eyes_bottts')}</summary>
            <div class="cb-section-body">${previewGrid('botttsEyes', self.BOTTTS_EYES, av.botttsEyes, av)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.mouth_bottts')}</summary>
            <div class="cb-section-body">${previewGrid('botttsMouth', self.BOTTTS_MOUTHS, av.botttsMouth, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.face_shape_alt')}</summary>
            <div class="cb-section-body">${previewGrid('botttsFace', self.BOTTTS_FACE, av.botttsFace || '', av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.sides')}</summary>
            <div class="cb-section-body">${previewGrid('botttsSides', self.BOTTTS_SIDES, av.botttsSides || '', av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.head_top')}</summary>
            <div class="cb-section-body">${previewGrid('botttsTop', self.BOTTTS_TOP, av.botttsTop || '', av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.body_texture')}</summary>
            <div class="cb-section-body">${previewGrid('botttsTexture', self.BOTTTS_TEXTURES, av.botttsTexture || '', av)}</div>
          </details>`;

        case 'fun-emoji': return `
          ${presetGrid('fun-emoji', self._t('profile.preset.emoji'))}
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.eyes')}</summary>
            <div class="cb-section-body">${previewGrid('emojiEyes', self.EMOJI_EYES, av.emojiEyes, av)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.mouth')}</summary>
            <div class="cb-section-body">${previewGrid('emojiMouth', self.EMOJI_MOUTHS, av.emojiMouth, av)}</div>
          </details>`;

        case 'pixel-art': return `
          ${presetGrid('pixel-art', self._t('profile.preset.hero'))}
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.skin')}</summary>
            <div class="cb-section-body">${colorGrid('pixelSkinColor', self.SKIN_COLORS, av.pixelSkinColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.hair')}</summary>
            <div class="cb-section-body">${previewGrid('pixelHair', self.PIXEL_HAIR, av.pixelHair, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.hair_color')}</summary>
            <div class="cb-section-body">${colorGrid('pixelHairColor', self.HAIR_COLORS, av.pixelHairColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.eyes')}</summary>
            <div class="cb-section-body">${previewGrid('pixelEyes', self.PIXEL_EYES, av.pixelEyes, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.mouth_happy')}</summary>
            <div class="cb-section-body">${previewGrid('pixelMouthHappy', self.PIXEL_MOUTH_HAPPY, av.pixelMouthHappy, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.mouth_sad')}</summary>
            <div class="cb-section-body">${previewGrid('pixelMouthSad', self.PIXEL_MOUTH_SAD, av.pixelMouthSad, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.clothing')}</summary>
            <div class="cb-section-body">${previewGrid('pixelClothing', self.PIXEL_CLOTHING, av.pixelClothing, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.beard')}</summary>
            <div class="cb-section-body">${previewGrid('pixelBeard', self.PIXEL_BEARD, av.pixelBeard, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.glasses')}</summary>
            <div class="cb-section-body">${previewGrid('pixelGlasses', self.PIXEL_GLASSES, av.pixelGlasses, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.hat')}</summary>
            <div class="cb-section-body">${previewGrid('pixelHat', self.PIXEL_HAT, av.pixelHat, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.accessories_alt')}</summary>
            <div class="cb-section-body">${previewGrid('pixelAccessories', self.PIXEL_ACCESSORIES, av.pixelAccessories, av)}</div>
          </details>`;

        case 'adventurer': return `
          ${presetGrid('adventurer', self._t('profile.preset.adventurer'))}
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.skin')}</summary>
            <div class="cb-section-body">${colorGrid('advSkinColor', self.SKIN_COLORS, av.advSkinColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.hair')}</summary>
            <div class="cb-section-body">${previewGrid('advHair', self.ADV_HAIR, av.advHair, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.hair_color')}</summary>
            <div class="cb-section-body">${colorGrid('advHairColor', self.HAIR_COLORS, av.advHairColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.eyes')}</summary>
            <div class="cb-section-body">${previewGrid('advEyes', self.ADV_EYES, av.advEyes, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.eyebrows')}</summary>
            <div class="cb-section-body">${previewGrid('advEyebrows', self.ADV_EYEBROWS, av.advEyebrows, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.mouth')}</summary>
            <div class="cb-section-body">${previewGrid('advMouth', self.ADV_MOUTH, av.advMouth, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.earrings')}</summary>
            <div class="cb-section-body">${previewGrid('advEarrings', self.ADV_EARRINGS, av.advEarrings, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.glasses')}</summary>
            <div class="cb-section-body">${previewGrid('advGlasses', self.ADV_GLASSES, av.advGlasses, av)}</div>
          </details>`;

        case 'lorelei': return `
          ${presetGrid('lorelei', self._t('profile.preset.character'))}
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.skin')}</summary>
            <div class="cb-section-body">${colorGrid('lorSkinColor', self.SKIN_COLORS, av.lorSkinColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.hair')}</summary>
            <div class="cb-section-body">${previewGrid('lorHair', self.LOR_HAIR, av.lorHair, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.hair_color')}</summary>
            <div class="cb-section-body">${colorGrid('lorHairColor', self.HAIR_COLORS, av.lorHairColor)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.face_shape')}</summary>
            <div class="cb-section-body">${previewGrid('lorHead', self.LOR_HEAD, av.lorHead, av)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.eyes')}</summary>
            <div class="cb-section-body">${previewGrid('lorEyes', self.LOR_EYES, av.lorEyes, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.eyebrows')}</summary>
            <div class="cb-section-body">${previewGrid('lorEyebrows', self.LOR_EYEBROWS, av.lorEyebrows, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.nose')}</summary>
            <div class="cb-section-body">${previewGrid('lorNose', self.LOR_NOSE, av.lorNose, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.mouth')}</summary>
            <div class="cb-section-body">${previewGrid('lorMouth', self.LOR_MOUTH, av.lorMouth, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.beard')}</summary>
            <div class="cb-section-body">${previewGrid('lorBeard', self.LOR_BEARD, av.lorBeard, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.earrings')}</summary>
            <div class="cb-section-body">${previewGrid('lorEarrings', self.LOR_EARRINGS, av.lorEarrings, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.glasses')}</summary>
            <div class="cb-section-body">${previewGrid('lorGlasses', self.LOR_GLASSES, av.lorGlasses, av)}</div>
          </details>`;

        case 'big-smile': return `
          ${presetGrid('big-smile', self._t('profile.preset.big_smile'))}
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.skin')}</summary>
            <div class="cb-section-body">${colorGrid('bsmileSkinColor', self.SKIN_COLORS, av.bsmileSkinColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.hair')}</summary>
            <div class="cb-section-body">${previewGrid('bsmileHair', self.BSMILE_HAIR, av.bsmileHair, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.hair_color')}</summary>
            <div class="cb-section-body">${colorGrid('bsmileHairColor', self.HAIR_COLORS, av.bsmileHairColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.eyes')}</summary>
            <div class="cb-section-body">${previewGrid('bsmileEyes', self.BSMILE_EYES, av.bsmileEyes, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.mouth')}</summary>
            <div class="cb-section-body">${previewGrid('bsmileMouth', self.BSMILE_MOUTHS, av.bsmileMouth, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.accessories_theater')}</summary>
            <div class="cb-section-body">${previewGrid('bsmileAccessories', self.BSMILE_ACCESSORIES, av.bsmileAccessories, av)}</div>
          </details>`;

        case 'notionists': return `
          ${presetGrid('notionists', self._t('profile.preset.notion'))}
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.skin')}</summary>
            <div class="cb-section-body">${colorGrid('notionSkinColor', self.SKIN_COLORS, av.notionSkinColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.hair')}</summary>
            <div class="cb-section-body">${previewGrid('notionHair', self.NOTION_HAIR, av.notionHair, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.hair_color')}</summary>
            <div class="cb-section-body">${colorGrid('notionHairColor', self.HAIR_COLORS, av.notionHairColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.eyes')}</summary>
            <div class="cb-section-body">${previewGrid('notionEyes', self.NOTION_EYES, av.notionEyes, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.lips')}</summary>
            <div class="cb-section-body">${previewGrid('notionLips', self.NOTION_LIPS, av.notionLips, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.eyebrows')}</summary>
            <div class="cb-section-body">${previewGrid('notionBrows', self.NOTION_BROWS, av.notionBrows, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.nose')}</summary>
            <div class="cb-section-body">${previewGrid('notionNose', self.NOTION_NOSE, av.notionNose, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.beard')}</summary>
            <div class="cb-section-body">${previewGrid('notionBeard', self.NOTION_BEARD, av.notionBeard, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.glasses')}</summary>
            <div class="cb-section-body">${previewGrid('notionGlasses', self.NOTION_GLASSES, av.notionGlasses, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.body')}</summary>
            <div class="cb-section-body">${previewGrid('notionBody', self.NOTION_BODY, av.notionBody, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.body_icon')}</summary>
            <div class="cb-section-body">${previewGrid('notionBodyIcon', self.NOTION_BODY_ICON, av.notionBodyIcon, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.gesture')}</summary>
            <div class="cb-section-body">${previewGrid('notionGesture', self.NOTION_GESTURE, av.notionGesture, av)}</div>
          </details>`;

        case 'toon-head': return `
          ${presetGrid('toon-head', self._t('profile.preset.toonhead'))}
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.skin')}</summary>
            <div class="cb-section-body">${colorGrid('toonheadSkinColor', self.SKIN_COLORS, av.toonheadSkinColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.hair_front')}</summary>
            <div class="cb-section-body">${previewGrid('toonheadHair', self.TOONHEAD_HAIR, av.toonheadHair, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.hair_color')}</summary>
            <div class="cb-section-body">${colorGrid('toonheadHairColor', self.HAIR_COLORS, av.toonheadHairColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.hair_back')}</summary>
            <div class="cb-section-body">${previewGrid('toonheadRearHair', self.TOONHEAD_REAR_HAIR, av.toonheadRearHair, av)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.eyes')}</summary>
            <div class="cb-section-body">${previewGrid('toonheadEyes', self.TOONHEAD_EYES, av.toonheadEyes, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.eyebrows')}</summary>
            <div class="cb-section-body">${previewGrid('toonheadEyebrows', self.TOONHEAD_EYEBROWS, av.toonheadEyebrows, av)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.mouth')}</summary>
            <div class="cb-section-body">${previewGrid('toonheadMouth', self.TOONHEAD_MOUTH, av.toonheadMouth, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.beard')}</summary>
            <div class="cb-section-body">${previewGrid('toonheadBeard', self.TOONHEAD_BEARD, av.toonheadBeard, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.clothing')}</summary>
            <div class="cb-section-body">${previewGrid('toonheadClothes', self.TOONHEAD_CLOTHES, av.toonheadClothes, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.clothing_color')}</summary>
            <div class="cb-section-body">${colorGrid('toonheadClothesColor', self.CLOTHING_COLORS, av.toonheadClothesColor)}</div>
          </details>`;

        case 'dylan': return `
          ${presetGrid('dylan', self._t('profile.preset.dylan'))}
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.skin')}</summary>
            <div class="cb-section-body">${colorGrid('dylanSkinColor', self.SKIN_COLORS, av.dylanSkinColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.hair')}</summary>
            <div class="cb-section-body">${previewGrid('dylanHair', self.DYLAN_HAIR, av.dylanHair, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.hair_color')}</summary>
            <div class="cb-section-body">${colorGrid('dylanHairColor', self.HAIR_COLORS, av.dylanHairColor)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.mood')}</summary>
            <div class="cb-section-body">${previewGrid('dylanMood', self.DYLAN_MOOD, av.dylanMood, av)}</div>
          </details>`;

        case 'croodles': return `
          ${presetGrid('croodles', self._t('profile.preset.croodle'))}
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.hair')}</summary>
            <div class="cb-section-body">${previewGrid('croodlesTop', self.CROODLES_TOP, av.croodlesTop, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.hair_style_color')}</summary>
            <div class="cb-section-body">${colorGrid('croodlesTopColor', self.CROODLES_TOP_COLORS, av.croodlesTopColor)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.face')}</summary>
            <div class="cb-section-body">${previewGrid('croodlesFace', self.CROODLES_FACE, av.croodlesFace, av)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">${self._t('profile.section.eyes')}</summary>
            <div class="cb-section-body">${previewGrid('croodlesEyes', self.CROODLES_EYES, av.croodlesEyes, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.mouth')}</summary>
            <div class="cb-section-body">${previewGrid('croodlesMouth', self.CROODLES_MOUTH, av.croodlesMouth, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.beard')}</summary>
            <div class="cb-section-body">${previewGrid('croodlesBeard', self.CROODLES_BEARD, av.croodlesBeard, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.mustache')}</summary>
            <div class="cb-section-body">${previewGrid('croodlesMustache', self.CROODLES_MUSTACHE, av.croodlesMustache, av)}</div>
          </details>
          <details class="cb-section">
            <summary class="cb-section-title">${self._t('profile.section.nose')}</summary>
            <div class="cb-section-body">${previewGrid('croodlesNose', self.CROODLES_NOSE, av.croodlesNose, av)}</div>
          </details>`;

        case 'bottts-neutral': return `
          ${presetGrid('bottts-neutral', '🦿 Choisir un robot neutre')}
          <details class="cb-section" open>
            <summary class="cb-section-title">👁️ Yeux du robot</summary>
            <div class="cb-section-body">${previewGrid('btntEyes', self.BOTTTS_EYES, av.btntEyes, av)}</div>
          </details>
          <details class="cb-section" open>
            <summary class="cb-section-title">🦾 Bouche du robot</summary>
            <div class="cb-section-body">${previewGrid('btntMouth', self.BOTTTS_MOUTHS, av.btntMouth, av)}</div>
          </details>`;

        default: return '';
      }
    };

    // ── HTML de la page ───────────────────────────────────────────────────
    container.innerHTML = `
      <div class="page">
        <div class="page-title">${self._t('profile.title')}</div>
        <p class="page-subtitle">${self._t('profile.subtitle')}</p>

        <div class="cb-layout">

          <!-- Panneau gauche : aperçu sticky -->
          <div class="cb-preview-panel">
            <div class="rank-badge-av-frame rank-badge-av-frame--${_rankKey}" style="--rbaf-size:200px;--rbaf-av-size:104px;">
              <div class="rank-badge-av-svg">${GL.RankBadges.svgFrameOnly(_rankKey)}</div>
              <img id="cbAvatarPreview" class="rank-badge-av-img" src="${self.avatarUrl(av, 160)}" alt="Avatar">
            </div>
            <div class="cb-name-edit">
              ${(profile.isGuest || !profile.name) ? `<p class="profile-save-hint" id="cbSaveHint">Entre ton prénom pour sauvegarder tes stats et apparaître dans le classement !</p>` : ''}
              <input class="profile-input" id="cbNameInput"
                type="text" value="${(profile.isGuest || !profile.name) ? '' : profile.name}"
                placeholder="${self._t('profile.welcome.placeholder')}" maxlength="20">
              ${(profile.isGuest || !profile.name) ? `<button class="btn btn-sm btn-primary cb-validate-btn" id="cbValidateBtn">Valider</button>` : ''}
            </div>
<button class="btn btn-sm btn-secondary" id="cbRandomBtn">${self._t('profile.random')}</button>
            ${(() => {
              const supabaseReady = window.GL_CONFIG?.SUPABASE_URL && !window.GL_CONFIG.SUPABASE_URL.includes('VOTRE_ID');
              if (!supabaseReady) return '';
              if (GL.Auth?.isGoogleUser?.()) {
                return `<div class="btn-google-connected">
                  <svg width="14" height="14" viewBox="0 0 48 48" style="vertical-align:middle;margin-right:5px;flex-shrink:0"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                  <span>${GL.Auth._user.email}</span>
                  <button class="btn-google-signout" id="cbGoogleSignout" title="Se déconnecter">✕</button>
                </div>`;
              }
              return `<button class="btn btn-sm btn-google" id="cbGoogleBtn">
                <svg width="14" height="14" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                <span>Se connecter avec Google</span>
              </button>`;
            })()}
          </div>

          <!-- Panneau droit -->
          <div class="cb-options-panel">

            <!-- Sélecteur de type de personnage -->
            <div class="cb-style-picker">
              ${self.STYLES.map(s => `
                <button class="cb-style-card ${s.id === styleId ? 'active' : ''}"
                  data-style-id="${s.id}" title="${s.desc}">
                  <div class="cb-style-card-avatar">
                    <img src="${s.id === 'avataaars'
                        ? 'https://api.dicebear.com/9.x/avataaars/svg?seed=humanX92&size=52&backgroundColor=b6e3f4&top=shortWaved&hairColor=724133&skinColor=d08b5b&eyes=happy&eyebrows=raisedExcited&mouth=twinkle&facialHair=beardMedium&facialHairColor=724133&accessories=round&accessoriesColor=3c4f5c&clothing=shirtVNeck&clothingColor=65c9ff'
                        : `https://api.dicebear.com/9.x/${s.id}/svg?seed=preview&size=52&backgroundColor=b6e3f4`}"
                      alt="${s.label}" width="52" height="52" loading="lazy">
                  </div>
                  <span>${s.emoji} ${s.label}</span>
                </button>
              `).join('')}
            </div>

            <!-- Fond (universel) -->
            <details class="cb-section" open>
              <summary class="cb-section-title">${self._t('profile.section.bg_color')}</summary>
              <div class="cb-section-body">${colorGrid('bgColor', self.BG_COLORS, av.bgColor)}</div>
            </details>

            <!-- Options spécifiques au style -->
            ${styleOptionsHtml()}

          </div>
        </div>
      </div>
    `;

    const preview = container.querySelector('#cbAvatarPreview');

    // ── Changer de style de personnage ────────────────────────────────────
    container.querySelectorAll('[data-style-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const base = self.get() || self.defaultProfile('Invité', true);
        base.avatar.style = btn.dataset.styleId;
        if (base.avatar.style !== 'avataaars') {
          if (!base.avatar.seed || base.avatar.seed === 'geolearn42') {
            base.avatar.seed = Math.random().toString(36).slice(2,8);
          }
        }
        if (base.avatar.style === 'toon-head' && !base.avatar.toonheadHair) {
          base.avatar.toonheadHair      = 'sideComed';
          base.avatar.toonheadEyes      = base.avatar.toonheadEyes      || 'happy';
          base.avatar.toonheadEyebrows  = base.avatar.toonheadEyebrows  || 'neutral';
          base.avatar.toonheadMouth     = base.avatar.toonheadMouth     || 'smile';
          base.avatar.toonheadClothes   = base.avatar.toonheadClothes   || 'tShirt';
        }
        self.save(base);
        self.updateNavAvatar(base);
        self.render(container);
      });
    });

    // ── Clic sur une option ou swatch ─────────────────────────────────────
    const PRESET_STYLE_ATTRS = {
      'bottts':         ['botttsEyes','botttsMouth','botttsFace','botttsSides','botttsTop','botttsTexture'],
      'fun-emoji':      ['emojiEyes','emojiMouth'],
      'pixel-art':      ['pixelHair','pixelHairColor','pixelSkinColor','pixelClothing','pixelEyes','pixelMouthHappy','pixelMouthSad','pixelAccessories','pixelBeard','pixelGlasses','pixelHat'],
      'adventurer':     ['advSkinColor','advHair','advHairColor','advEyes','advMouth','advEyebrows','advEarrings','advGlasses'],
      'lorelei':        ['lorSkinColor','lorHair','lorEyes','lorMouth','lorHairColor','lorEyebrows','lorHead','lorNose','lorBeard','lorEarrings','lorGlasses'],
      'big-smile':      ['bsmileSkinColor','bsmileHair','bsmileEyes','bsmileMouth','bsmileHairColor','bsmileAccessories'],
      'notionists':     ['notionSkinColor','notionHair','notionHairColor','notionEyes','notionLips','notionBrows','notionNose','notionBody','notionBeard','notionBodyIcon','notionGesture','notionGlasses'],
      'toon-head':      ['toonheadSkinColor','toonheadHairColor','toonheadEyes','toonheadEyebrows','toonheadMouth','toonheadClothes','toonheadClothesColor','toonheadHair','toonheadRearHair','toonheadBeard'],
      'dylan':          ['dylanSkinColor','dylanHair','dylanHairColor','dylanMood'],
      'croodles':       ['croodlesTop','croodlesTopColor','croodlesFace','croodlesEyes','croodlesMouth','croodlesNose','croodlesBeard','croodlesMustache'],
      'bottts-neutral': ['btntEyes','btntMouth'],
    };
    if (self._optionClickHandler) container.removeEventListener('click', self._optionClickHandler);
    const optionClickHandler = e => {
      const btn = e.target.closest('[data-feature][data-val]');
      if (!btn) return;
      const { feature, val } = btn.dataset;
      if (!feature) return;

      profile.avatar[feature] = val;

      // Sélection d'un preset : effacer les attributs du style pour correspondre à l'image affichée
      if (feature === 'seed') {
        (PRESET_STYLE_ATTRS[styleId] || []).forEach(a => delete profile.avatar[a]);
        self.save(profile);
        self.updateNavAvatar(profile);
        self.render(container);
        return;
      }

      self.save(profile);
      self.updateNavAvatar(profile);
      preview.src = self.avatarUrl(profile.avatar, 160);

      container.querySelectorAll(`[data-feature="${feature}"]`).forEach(b => {
        b.classList.remove('active');
        const chk = b.querySelector('.cb-check');
        if (chk) chk.remove();
        if (b.classList.contains('cb-color-swatch')) b.textContent = '';
      });
      btn.classList.add('active');
      if (btn.classList.contains('cb-option-btn')) {
        const wrap = btn.querySelector('.cb-option-img-wrap');
        if (wrap) { const c = document.createElement('span'); c.className='cb-check'; c.textContent='✓'; wrap.appendChild(c); }
      } else if (btn.classList.contains('cb-color-swatch')) {
        btn.textContent = '✓';
      }
    };
    self._optionClickHandler = optionClickHandler;
    container.addEventListener('click', optionClickHandler);

    // ── Sauvegarde ────────────────────────────────────────────────────────
    const nameInput = container.querySelector('#cbNameInput');

    nameInput.addEventListener('input', () => {
      nameInput.style.borderColor = '';
      const newName = nameInput.value.trim();
      if (newName) {
        profile.name = newName;
        profile.isGuest = false;
        self.save(profile);
        self.updateNavAvatar(profile);
        if (window.GL && GL.Auth) GL.Auth.scheduleSync(newName);
      }
    });

    const validateBtn = container.querySelector('#cbValidateBtn');
    if (validateBtn) validateBtn.addEventListener('click', () => {
      const newName = nameInput.value.trim();
      if (!newName) { nameInput.focus(); nameInput.style.borderColor = 'var(--error)'; return; }
      profile.name = newName;
      profile.isGuest = false;
      self.save(profile);
      self.updateNavAvatar(profile);
      if (window.GL && GL.Auth) GL.Auth.onProfileNameSet(newName);
      const hint = container.querySelector('#cbSaveHint');
      if (hint) hint.remove();
      validateBtn.remove();
      nameInput.value = newName;
      GL.UI.toast('Profil sauvegardé !', 'success');
    });

    // ── Avatar aléatoire ──────────────────────────────────────────────────
    container.querySelector('#cbRandomBtn').addEventListener('click', () => {
      const rand    = arr => arr[Math.floor(Math.random() * arr.length)].val;
      const randDOM = (feature, fallback) => {
        const btns = [...container.querySelectorAll(`[data-feature="${feature}"]`)]
          .filter(b => b.style.display !== 'none');
        return btns.length
          ? btns[Math.floor(Math.random() * btns.length)].dataset.val
          : rand(fallback);
      };
      if (styleId === 'avataaars') {
        profile.avatar = {
          ...profile.avatar,
          top:              rand(self.TOPS),
          hairColor:        rand(self.HAIR_COLORS),
          hatColor:         rand(self.HAT_COLORS),
          skinColor:        rand(self.SKIN_COLORS),
          eyes:             rand(self.EYES),
          eyebrows:         rand(self.EYEBROWS),
          mouth:            rand(self.MOUTHS),
          facialHair:       Math.random() > 0.6 ? rand(self.FACIAL_HAIR.slice(1)) : 'blank',
          facialHairColor:  rand(self.FACIAL_HAIR_COLORS),
          accessories:      Math.random() > 0.6 ? rand(self.ACCESSORIES.slice(1)) : 'blank',
          accessoriesColor: rand(self.ACCESSORIES_COLORS),
          clothing:         rand(self.CLOTHING),
          clothingColor:    rand(self.CLOTHING_COLORS),
          clothingGraphic:  rand(self.GRAPHIC_SHIRTS),
        };
      } else {
        const randPreset = () => self.AVATAR_PRESETS[Math.floor(Math.random() * self.AVATAR_PRESETS.length)];
        profile.avatar.seed = randPreset();
        if (styleId === 'bottts') {
          profile.avatar.botttsEyes    = rand(self.BOTTTS_EYES);
          profile.avatar.botttsMouth   = rand(self.BOTTTS_MOUTHS);
          profile.avatar.botttsFace    = Math.random() > 0.5 ? rand(self.BOTTTS_FACE)    : '';
          profile.avatar.botttsSides   = Math.random() > 0.5 ? rand(self.BOTTTS_SIDES)   : '';
          profile.avatar.botttsTop     = Math.random() > 0.5 ? rand(self.BOTTTS_TOP)     : '';
          profile.avatar.botttsTexture = Math.random() > 0.6 ? rand(self.BOTTTS_TEXTURES): '';
        }
        if (styleId === 'fun-emoji') {
          profile.avatar.emojiEyes  = rand(self.EMOJI_EYES);
          profile.avatar.emojiMouth = rand(self.EMOJI_MOUTHS);
        }
        if (styleId === 'pixel-art') {
          profile.avatar.pixelHair         = randDOM('pixelHair',      self.PIXEL_HAIR);
          profile.avatar.pixelHairColor    = rand(self.HAIR_COLORS);
          profile.avatar.pixelSkinColor    = rand(self.SKIN_COLORS);
          profile.avatar.pixelClothing     = randDOM('pixelClothing',  self.PIXEL_CLOTHING);
          profile.avatar.pixelEyes         = Math.random() > 0.3 ? randDOM('pixelEyes',        self.PIXEL_EYES)         : '';
          profile.avatar.pixelMouthHappy   = Math.random() > 0.5 ? randDOM('pixelMouthHappy',  self.PIXEL_MOUTH_HAPPY)  : '';
          profile.avatar.pixelMouthSad     = '';
          profile.avatar.pixelBeard        = Math.random() > 0.7 ? rand(self.PIXEL_BEARD)      : '';
          profile.avatar.pixelGlasses      = Math.random() > 0.7 ? rand(self.PIXEL_GLASSES)    : '';
          profile.avatar.pixelHat          = Math.random() > 0.7 ? rand(self.PIXEL_HAT)        : '';
          profile.avatar.pixelAccessories  = Math.random() > 0.7 ? rand(self.PIXEL_ACCESSORIES): '';
        }
        if (styleId === 'adventurer') {
          profile.avatar.advSkinColor  = rand(self.SKIN_COLORS);
          profile.avatar.advHair       = randDOM('advHair',      self.ADV_HAIR);
          profile.avatar.advHairColor  = rand(self.HAIR_COLORS);
          profile.avatar.advEyes       = randDOM('advEyes',      self.ADV_EYES);
          profile.avatar.advMouth      = randDOM('advMouth',     self.ADV_MOUTH);
          profile.avatar.advEyebrows   = Math.random() > 0.4 ? randDOM('advEyebrows',  self.ADV_EYEBROWS)  : '';
          profile.avatar.advEarrings   = Math.random() > 0.6 ? randDOM('advEarrings',  self.ADV_EARRINGS)  : '';
          profile.avatar.advGlasses    = Math.random() > 0.7 ? randDOM('advGlasses',   self.ADV_GLASSES)   : '';
        }
        if (styleId === 'lorelei') {
          profile.avatar.lorSkinColor  = rand(self.SKIN_COLORS);
          profile.avatar.lorHair       = randDOM('lorHair',      self.LOR_HAIR);
          profile.avatar.lorHairColor  = rand(self.HAIR_COLORS);
          profile.avatar.lorEyes       = randDOM('lorEyes',      self.LOR_EYES);
          profile.avatar.lorMouth      = randDOM('lorMouth',     self.LOR_MOUTH);
          profile.avatar.lorHead       = Math.random() > 0.4 ? randDOM('lorHead',       self.LOR_HEAD)      : '';
          profile.avatar.lorEyebrows   = Math.random() > 0.4 ? randDOM('lorEyebrows',   self.LOR_EYEBROWS)  : '';
          profile.avatar.lorNose       = Math.random() > 0.4 ? randDOM('lorNose',        self.LOR_NOSE)      : '';
          profile.avatar.lorBeard      = Math.random() > 0.7 ? randDOM('lorBeard',       self.LOR_BEARD)     : '';
          profile.avatar.lorEarrings   = Math.random() > 0.6 ? randDOM('lorEarrings',   self.LOR_EARRINGS)  : '';
          profile.avatar.lorGlasses    = Math.random() > 0.7 ? randDOM('lorGlasses',    self.LOR_GLASSES)   : '';
        }
        if (styleId === 'big-smile') {
          profile.avatar.bsmileSkinColor    = rand(self.SKIN_COLORS);
          profile.avatar.bsmileHair         = randDOM('bsmileHair',         self.BSMILE_HAIR);
          profile.avatar.bsmileHairColor    = rand(self.HAIR_COLORS);
          profile.avatar.bsmileEyes         = randDOM('bsmileEyes',         self.BSMILE_EYES);
          profile.avatar.bsmileMouth        = randDOM('bsmileMouth',        self.BSMILE_MOUTHS);
          profile.avatar.bsmileAccessories  = Math.random() > 0.6 ? rand(self.BSMILE_ACCESSORIES) : '';
        }
        if (styleId === 'notionists') {
          profile.avatar.notionSkinColor  = rand(self.SKIN_COLORS);
          profile.avatar.notionHair       = randDOM('notionHair',       self.NOTION_HAIR);
          profile.avatar.notionHairColor  = rand(self.HAIR_COLORS);
          profile.avatar.notionEyes       = randDOM('notionEyes',       self.NOTION_EYES);
          profile.avatar.notionLips       = randDOM('notionLips',       self.NOTION_LIPS);
          profile.avatar.notionBrows      = Math.random() > 0.4 ? randDOM('notionBrows',    self.NOTION_BROWS)    : '';
          profile.avatar.notionNose       = Math.random() > 0.4 ? randDOM('notionNose',     self.NOTION_NOSE)     : '';
          profile.avatar.notionBeard      = Math.random() > 0.7 ? rand(self.NOTION_BEARD)                        : '';
          profile.avatar.notionGlasses    = Math.random() > 0.7 ? rand(self.NOTION_GLASSES)                      : '';
          profile.avatar.notionBody       = Math.random() > 0.4 ? rand(self.NOTION_BODY)                         : '';
          profile.avatar.notionBodyIcon   = Math.random() > 0.6 ? rand(self.NOTION_BODY_ICON)                    : '';
          profile.avatar.notionGesture    = Math.random() > 0.6 ? rand(self.NOTION_GESTURE)                      : '';
        }
        if (styleId === 'toon-head') {
          profile.avatar.toonheadSkinColor   = rand(self.SKIN_COLORS);
          profile.avatar.toonheadHairColor   = rand(self.HAIR_COLORS);
          profile.avatar.toonheadClothesColor= rand(self.CLOTHING_COLORS);
          profile.avatar.toonheadHair        = Math.random() > 0.2 ? rand(self.TOONHEAD_HAIR)      : '';
          profile.avatar.toonheadRearHair    = Math.random() > 0.5 ? rand(self.TOONHEAD_REAR_HAIR) : '';
          profile.avatar.toonheadEyes        = rand(self.TOONHEAD_EYES);
          profile.avatar.toonheadEyebrows    = rand(self.TOONHEAD_EYEBROWS);
          profile.avatar.toonheadMouth       = rand(self.TOONHEAD_MOUTH);
          profile.avatar.toonheadClothes     = rand(self.TOONHEAD_CLOTHES);
          profile.avatar.toonheadBeard       = Math.random() > 0.7 ? rand(self.TOONHEAD_BEARD) : '';
        }
        if (styleId === 'dylan') {
          profile.avatar.dylanSkinColor  = rand(self.SKIN_COLORS);
          profile.avatar.dylanHair       = rand(self.DYLAN_HAIR);
          profile.avatar.dylanHairColor  = rand(self.HAIR_COLORS);
          profile.avatar.dylanMood       = rand(self.DYLAN_MOOD);
        }
        if (styleId === 'croodles') {
          profile.avatar.croodlesTop       = randDOM('croodlesTop',       self.CROODLES_TOP);
          profile.avatar.croodlesTopColor  = rand(self.CROODLES_TOP_COLORS);
          profile.avatar.croodlesFace      = Math.random() > 0.4 ? rand(self.CROODLES_FACE)     : '';
          profile.avatar.croodlesEyes      = randDOM('croodlesEyes',      self.CROODLES_EYES);
          profile.avatar.croodlesMouth     = randDOM('croodlesMouth',     self.CROODLES_MOUTH);
          profile.avatar.croodlesBeard     = Math.random() > 0.7 ? rand(self.CROODLES_BEARD)    : '';
          profile.avatar.croodlesMustache  = Math.random() > 0.7 ? rand(self.CROODLES_MUSTACHE) : '';
          profile.avatar.croodlesNose      = Math.random() > 0.4 ? rand(self.CROODLES_NOSE)     : '';
        }
        if (styleId === 'bottts-neutral') {
          profile.avatar.btntEyes  = rand(self.BOTTTS_EYES);
          profile.avatar.btntMouth = rand(self.BOTTTS_MOUTHS);
        }
      }
      self.save(profile);
      self.updateNavAvatar(profile);
      const newUrl = self.avatarUrl(profile.avatar, 160);
      const previewEl = document.getElementById('cbAvatarPreview') || preview;
      const tmp = new Image();
      tmp.onload = () => { previewEl.src = newUrl; };
      tmp.onerror = () => {
        setTimeout(() => {
          const tmp2 = new Image();
          tmp2.onload = () => { previewEl.src = newUrl; };
          tmp2.onerror = () => { previewEl.src = newUrl; }; // show whatever we get
          tmp2.src = newUrl + '&_r=1';
        }, 1500);
      };
      tmp.src = newUrl;
      // Sync active states without full re-render (avoids flooding DiceBear API)
      [...container.querySelectorAll('[data-feature][data-val]')].forEach(b => {
        const { feature, val } = b.dataset;
        const isActive = profile.avatar[feature] === val;
        b.classList.toggle('active', isActive);
        const chk = b.querySelector('.cb-check');
        if (chk) chk.remove();
        if (b.classList.contains('cb-color-swatch')) b.textContent = isActive ? '✓' : '';
        if (isActive && b.classList.contains('cb-option-btn')) {
          const wrap = b.querySelector('.cb-option-img-wrap');
          if (wrap) {
            const c = document.createElement('span');
            c.className = 'cb-check';
            c.textContent = '✓';
            wrap.appendChild(c);
          }
        }
      });
    });

    // ── Connexion Google ──────────────────────────────────────────────────────
    const googleBtn   = container.querySelector('#cbGoogleBtn');
    const googleSignout = container.querySelector('#cbGoogleSignout');
    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        googleBtn.disabled = true;
        googleBtn.querySelector('span').textContent = 'Connexion…';
        await GL.Auth.signInWithGoogle();
        setTimeout(() => {
          googleBtn.disabled = false;
          googleBtn.querySelector('span').textContent = 'Se connecter avec Google';
        }, 5000);
      });
    }
    if (googleSignout) {
      googleSignout.addEventListener('click', async () => {
        await GL.Auth.signOut();
        GL.UI.toast('Déconnecté de Google', 'info');
        GL.Router.go('#/profil');
      });
    }

    // ── Masquer les sections dont toutes les images échouent ─────────────────
    const hideEmptySections = () => {
      container.querySelectorAll('.cb-section').forEach(section => {
        const btns = section.querySelectorAll('.cb-option-grid .cb-option-btn');
        if (btns.length && [...btns].every(b => b.style.display === 'none')) {
          section.style.display = 'none';
        }
      });
    };

    // ── Attendre que les images d'options soient chargées avant d'activer "Aléatoire" ──
    const randomBtn  = container.querySelector('#cbRandomBtn');
    const optionImgs = [...container.querySelectorAll('.cb-option-btn img')];
    let pending = optionImgs.filter(img => !img.complete).length;
    if (pending > 0) {
      randomBtn.disabled = true;
      const onSettle = () => { if (--pending <= 0) { randomBtn.disabled = false; hideEmptySections(); } };
      optionImgs
        .filter(img => !img.complete)
        .forEach(img => {
          img.addEventListener('load',  onSettle, { once: true });
          img.addEventListener('error', onSettle, { once: true });
        });
    }
    // Passe initiale : sections vides depuis le cache ou images déjà chargées
    setTimeout(hideEmptySections, 50);

  }
};
