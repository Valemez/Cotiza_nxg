document.addEventListener('DOMContentLoaded', function () {
    // elementos
    const stepMenus = [
        document.querySelector('.crs-step-menu1'),
        document.querySelector('.crs-step-menu2'),
        document.querySelector('.crs-step-menu3'),
        document.querySelector('.crs-step-menu4'),
        document.querySelector('.crs-step-menu5')
    ];

    const steps = [
        document.querySelector('.crs-form-step-1'),
        document.querySelector('.crs-form-step-2'),
        document.querySelector('.crs-form-step-3'),
        document.querySelector('.crs-form-step-4'),
        document.querySelector('.crs-form-step-5')
    ];

    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const form = document.querySelector('form');
    const serviceCheckboxes = document.querySelectorAll('input[name="servicios[]"]');
    const equipmentList = document.getElementById('equipment-list');
    const summaryDetails = document.getElementById('summary-details');

    let currentStep = 0;

    //manejo de estados y municipios
    const centrosPorEstado = {
        Aguascalientes: ['aguascalientes', 'asientos', 'calvillo', 'cosío', 'jesús maría', 'pabellón de arteaga', 'rincón de romos', 'san josé de gracia', 'tepezalá', 'el llano', 'san francisco de los romo'],
        Baja_California: ['mexicali', 'ensenada', 'tecate', 'tijuana', 'playas de rosarito', 'san quintín', 'san felipe'],
        Baja_California_Sur: ['la paz', 'los cabos', 'comondú', 'mulegé', 'loreto'],
        Campeche: ['calkiní', 'campeche', 'carmen', 'champotón', 'hecelchakán', 'hopelchén', 'palizada', 'tenabo', 'escárcega', 'calakmul', 'candelaria', 'seybaplaya', 'dzitbalché'],
        Coahuila: ['acuña', 'allende', 'arteaga', 'candela', 'castaños', 'cierro de la cruz', 'francisco i. madero', 'frias', 'general cepeda', 'guerrero', 'hidalgo', 'jiménez', 'juárez', 'matamoros', 'monclova', 'morelos', 'múzquiz', 'nadadores', 'nava', 'o. v. blanco', 'parras', 'piedras negras', 'progreso', 'ramos arizpe', 'sabino cantera', 'sacramento', 'saltillo', 'san buenaventura', 'san juan de sabinas', 'san pedro', 'sierra mojada', 'torreón', 'viesca', 'villa unión', 'zacatecas'],
        Colima: ['colima', 'comala', 'coquimatlán', 'cuauhtémoc', 'minatitlán', 'tecomán', 'villa de álvarez'],
        Chiapas: ['acacoyagua', 'acala', 'acapetahua', 'altamirano', 'amatenango de la frontera', 'amatenango del valle', 'ángel albino corzo', 'arriaga', 'bejucal de oñate', 'benemérito de las américas', 'berriozábal', 'bochil', 'cácum', 'catazajá', 'chalmita', 'chapultenango', 'chenalhó', 'chiapa de corzo', 'chiapilla', 'chinguitiro', 'chintalapa', 'chiquihuitán', 'chimaltán', 'chapas', 'comitán de domínguez', 'frontera comalapa', 'frontera grande', 'frontera hidalgo', 'huehuetán', 'huixtán', 'huixtla', 'la concordia', 'las margaritas', 'las rosas', 'mapastepec', 'maravilla tenejapa', 'marqués de comillas', 'mezcalapa', 'mitontic', 'motul de carrillo puerto', 'oxchuc', 'pijijiapan', 'playas de catazajá', 'pueblo nuevo solistahuacán', 'pijijiapan', 'palenque', 'pantepec', 'pichucalco', 'pijijiapan', 'pijijiapan', 'pijijiapan', 'reforma', 'sabanilla', 'salto de agua', 'san cristóbal de las casas', 'santiago el pinar', 'simojovel', 'socoltenango', 'solosuchiapa', 'sunuapa', 'tapachula', 'tapilula', 'tumbalá', 'tuxtla gutiérrez', 'tuxtla chico', 'tuzantán', 'venustiano carranza', 'villaflores', 'yajalón', 'yacaltán', 'yajalón', 'yajalón'],
        Chihuahua: ['ahuachapán', 'ahumada', 'allende', 'aquiles serdán', 'ascensión', 'azul', 'bachíniva', 'balleza', 'batopilas', 'bocoyna', 'buenaventura', 'camargo', 'carichí', 'casas grandes', 'chihuahua', 'chínipas', 'coronado', 'cuauhtémoc', 'cusihuiriachi', 'delicias', 'gran morelos', 'guachochi', 'guadalupe', 'guerrero', 'habilitas', 'hartman', 'hidalgo del parral', 'higueras', 'huachinera', 'juárez', 'julimes', 'la cruz', 'madera', 'maguarichi', 'manuel benavides', 'matamoros', 'mazapil', 'meoqui', 'morelos', 'namiquipa', 'nonoava', 'novo', 'nuevo caserío', 'ocampo', 'ocasio', 'penitas', 'praxedis guerrero', 'rosales', 'san francisco de borja', 'saucillo', 'satevó', 'saucillo', 'san francisco de conchos', 'san francisco del oro', 'san juanito', 'santa bárbara', 'santa isabel', 'satevó', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo', 'saucillo'],
        Durango: ['canatlán', 'canelas', 'coneto de comonfort', 'cuencamé', 'durango', 'general simón bolívar', 'guanaceví', 'gómez palacio', 'gral. pedro escobedo', 'gral. trinidad garcía de la cadena', 'gral. san martín', 'gral. domingo sabas herrera', 'gral. santana', 'gral. ramos arizpe', 'gral. ignacio allende', 'gral. melchor ocampo', 'gral. v. carranza', 'gral. josé maría morelos y pavón', 'gral. vicente guerrero', 'gral. francisco villa', 'gral. anaya', 'gral. herrera', 'gral. sánchez navarro', 'gral. trujillo', 'gral. zaragoza', 'guadalupe victoria', 'guerrero', 'indé', 'jasper', 'jiménez', 'la palma', 'lópez velarde', 'mapimí', 'mezquital', 'nombre de dios', 'opo', 'oteapan', 'oteapa', 'pánuco', 'peñón blanco', 'poanas', 'pueblo nuevo', 'río dulce', 'san bernardo', 'san dionisio', 'san juan de guadalupe', 'san luis del cordero', 'san luis del real', 'san pedro del gavilán', 'san rafael', 'santa maría de oro', 'santiago papasquiaro', 'súchil', 'tamazula', 'tepehuanes', 'topia', 'vicente guerrero', 'nombre de dios'],
        Ciudad_de_México: ['álvaro obregón', 'azcapotzalco', 'benito juárez', 'coyoacán', 'cuajimalpa de morelos', 'culhuacán', 'gustavo a. madero', 'iztacalco', 'iztapalapa', 'magdalena contreras', 'miguel hidalgo', 'milpa alta', 'tlahuac', 'tlalpan', 'venustiano carranza', 'xochimilco'],
        Guanajuato: ['abasolo', 'acámbaro', 'san miguel de allende', 'celaya', 'guanajuato', 'irapuato', 'león', 'manuel dócarr', 'moroleón', 'salvatierra', 'silao', 'valle de santiago', 'villagrán', 'yuriria', 'tarimoro', 'comonfort', 'cortazar', 'dolores hidalgo', 'doctor mora', 'pénjamo', 'san diego de la unión', 'san felipe', 'santiago maravatío', 'apaseo el grande', 'apaseo el alto', 'atarjea', 'charo', 'coroneo', 'doctor t. sierra', 'huanímaro', 'jerécuaro', 'pueblo nuevo', 'salamanca', 'santa cruz de juventino rosas', 'tarandacuao', 'uriangato'],
        Guerrero: ['acapulco de juárez', 'ahuacuotzingo', 'ajuchitlán del progreso', 'alcozauca de guerrero', 'apaxtla', 'arlitlan', 'atlamajalcingo del monte', 'atoyac de álvarez', 'azolapa', 'balsas', 'cacalotenango', 'cahuatlán', 'camilpa de guerrero', 'chilapa de álvarez', 'chilpancingo de los bravo', 'coahuayutla de josé maría izazaga', 'copala', 'copalillo', 'copanatoyac', 'coquimatlán', 'coyuca de benítez', 'coyuca de catalán', 'cuajinicuilapa', 'cualác', 'cuautepec', 'cuetzala del progreso', 'cula', 'culebra', 'culiacán', 'cunduacán', 'defensas de guerrero', 'el ocote', 'iguatemi', 'iguatema', 'ilhuitlán', 'ilpitlán', 'izúcar de matamoros', 'jaracuaro', 'jalisco', 'juárez', 'la unión de isidoro montes de oca', 'la perla', 'las minas', 'las minas de opichén', 'lashiguajes', 'malinaltepec', 'maxcanú', 'metlatónoc', 'mezcalapa', 'mezquitic', 'mozonte', 'nicolás ruíz', 'olinalá', 'pueblo nuevo', 'quechultenango', 'san marcos', 'san marcos', 'san miguel totolapan', 'santa cruz', 'santiago', 'tepecoacuilco de trujano', 'tepecoacuilco de trujano', 'tetipac', 'tixtla de guerrero', 'tlalchapa', 'tlapa de comonfort', 'tlapehuala', 'xalpatláhuac', 'xochihuehuetlán', 'zacualpan', 'zetina', 'zulay'],
        Hidalgo: ['actopan', 'agua blanca de iturbide', 'ajacuba', 'altamirano', 'calnali', 'chapulhuacán', 'chapantongo', 'epazoyucan', 'etla', 'filomeno mata', 'huautepec', 'huejutla de reyes', 'huejutla de reyes', 'huichapan', 'jacala de lema', 'jaltocán', 'jilotepec', 'joaquín amarilla', 'mineral del monte', 'mineral del monte', 'mineral de la reforma', 'molango de escamilla', 'nicolás flores', 'nicolás flores', 'ombligo de culebra', 'pachuca de soto', 'pachuca de soto', 'pisaflores', 'progreso de obregón', 'san agustín tlaxiaca', 'san agustín tlaxiaca', 'san agustín tlaxiaca', 'san bartolo tutotepec', 'san felipe orizatlán', 'san josé del rincón', 'san luis potosí', 'san luis potosí', 'santiago tulantepec de lugo guerrero', 'singuilucan', 'tizayuca', 'tlanchinol', 'tula de allende', 'tula de allende', 'xochiatipan', 'yacambu', 'zacualtipán de ángeles'],
        Jalisco: ['ajijic', 'atotonilco el alto', 'autlán de navarro', 'cabo corrientes', 'casimiro castillo', 'ciudad guzman', 'concepción de buenos aires', 'cocula', 'colotlán', 'el grullo', 'el salto', 'guadalajara', 'hostotipaquillo', 'jamaica', 'lagos de moreno', 'la manzanilla de la paz', 'mexticacán', 'mezquitic', 'nahuatzen', 'ocotlán', 'pihuamo', 'pueblo viejo', 'puerto vallarta', 'san cristóbal de la barranca', 'san gabriel', 'san ignacio cerro gordo', 'san juan de los lagos', 'san marcos', 'san martín de bolaños', 'san miguel el alto', 'san sebastián del oeste', 'santa maría del oro', 'tapalpa', 'teocaltiche', 'tequila', 'tizapán el alto', 'tlaquepaque', 'tonalá', 'tuxcueca', 'tuxpan', 'valle de guadalajara', 'zacatecas'],
        Estado_de_México: ['acambay', 'ametlám', 'atenco', 'atizapán de zaragoza', 'atlautla', 'axapusco', 'ayapango', 'coacalco de berriozábal', 'coatepec harinas', 'coyotepec', 'cuautitlán izcalli', 'ecatepec de morelos', 'el oro', 'huehuetoca', 'huixquilucan', 'ixtapaluca', 'jaltenco', 'joquicingo', 'juchitepec', 'lerma', 'linares', 'malinalco', 'melchor ocampo', 'metepec', 'nezahualcóyotl', 'nextlalpan', 'nicolás romero', 'otzolotepec', 'oxtotitlán', 'teoloyucan', 'teotihuacán', 'texcoco', 'tonanitla', 'tonatico', 'tultitlán', 'valle de bravo', 'valle del chalco solidaridad', 'xalatlaco', 'zacualpan'],
        Michoacán: ['acuitzio', 'aguililla', 'apan', 'ario de rosales', 'charapan', 'charo', 'chilchota', 'chinguindzio', 'chinguitiro', 'ciudad hidalgo', 'coalcomán de vazquez pallares', 'cojumatlán de régules', 'comodoro', 'copándaro', 'cotija', 'cuapiaxtla', 'cuitzeo del porvenir', 'ereno de rosales', 'ereno de rosales', 'ereno de rosales', 'erongarícuaro', 'huetamo de núñez', 'jiménez', 'la huacana', 'lázaro cárdenas', 'maravatío', 'morelia', 'nahuatzen', 'nuevo parangaricutiro', 'paracho', 'parácuaro', 'pátzcuaro', 'penjamillo', 'peribán', 'puruándiro', 'querendaro', 'queréndaro', 'tingambato', 'tingüindín', 'tizapán', 'tocumbo', 'tumbiscatío', 'tuzantla', 'turicato', 'urén', 'urúapan', 'zacapu', 'zamora'],
        Morelos: ['atetla', 'axochiapan', 'ayala', 'cuernavaca', 'cuautla', 'emiliano zapata', 'huitzilac', 'temixco', 'tlalpan', 'xochitepec', 'yautepec', 'yecapixtla', 'zacualpan'],
        Nayarit: ['acaponeta', 'compostela', 'del nte. rosario', 'huajicori', 'jala', 'xacxam', 'tepic', 'santiago ixcuintla', 'tecuala', 'tuxpan'],
        Nuevo_León: ['abadín', 'anáhuac', 'apodaca', 'cadereyta jiménez', 'china', 'ciénega de flores', 'doctor arroyo', 'garcía', 'general escobedo', 'guadalupe', 'hidalgo', 'lampazos de naranjo', 'marín', 'melchor ocampo', 'montemorelos', 'monterrey', 'parás', 'pesquería', 'poncitlán', 'santa catarina', 'santiago', 'vallecillo', 'villaldama'],
        Oaxaca: ['ahuachapán', 'ahuacatlán', 'axochiapan', 'ayala', 'ciudad hidalgo', 'coatepec harinas', 'cuautla', 'cuernavaca', 'huitzilac', 'ixtepec', 'juchitepec', 'la cruz', 'loma bonita', 'matías romero', 'miahuatlán de porfirio díaz', 'mixtla', 'nocautla', 'oyamel', 'puebla', 'putla', 'san juan bautista tlacoatzintepec', 'san juan guichicovi', 'san juan teitipac', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita', 'san juan yucuita'],
        Puebla: ['acatlán', 'acatzingo', 'ahuazotepec', 'ahuehuetitla', 'alcoyotla', 'aljojuca', 'alcala de guadalupe', 'altotonga', 'apatlaco', 'arcinga', 'atlixco', 'axochiapan', 'calpan', 'caltepec', 'camocuautla', 'chignautla', 'chuxtla', 'coatepec harinas', 'coatzingo', 'cohetzala', 'coxcatlán', 'cuautempan', 'cuayuca de andrade', 'cuetzalan del progreso', 'huachinango', 'huehuetlán el grande', 'huejotzingo', 'huitziltepec', 'izúcar de matamoros', 'izúcar de matamoros', 'ixtepec', 'jopala', 'juxtlahuaca', 'la perla', 'las minas', 'mazapil', 'mixtla', 'nicolás ruíz', 'puebla', 'quecholtepec', 'san andrés cholula', 'san diego la unión', 'san juan', 'san martín texmelucan', 'san pablo anicano', 'san pedro cholula', 'san salvador el verde', 'san simón', 'santa isabel cholula', 'santiago', 'tehuacán', 'tepexi de rodríguez', 'teziutlán', 'tlacotepec de juárez', 'tlaxcalancingo', 'totoltepec de guerrero', 'xicotepec de juárez', 'zacapoaxtla'],
        Querétaro: ['arroyos', 'ahuacatlán', 'apaseo el alto', 'apaseo el grande', 'celaya', 'corregidora', 'huimilpan', 'jalpan de serra', 'landa de matamoros', 'peñamiller', 'pinal de amoles', 'querétaro', 'san juan del río', 'el marqués', 'tequisquiapan'],
        Quintana_Roo: ['benito juárez', 'cozumel', 'felipe carrillo puerto', 'islita', 'lázaro cárdenas', 'opepel', 'tulum'],
        San_Luis_Potosí: ['ahualulco', 'amazcala', 'armadillo de los infante', 'cierro de san pedro', 'ciudad valles', 'cuadrilla', 'cárdenas', 'charcas', 'ciudad fernando', 'edomex', 'ehécatl', 'guadalcázar', 'hidalgo', 'matehuala', 'río verde', 'salinas', 'san luis potosí', 'tamuín', 'tancanhuitz', 'tamazunchale', 'tampacán', 'tanlajás', 'tanlajas', 'tanquián', 'tierra nueva', 'vanegas', 'venado', 'villa de arriaga', 'villagrán', 'xilitla'],
        Sinaloa: ['aguascalientes', 'altata', 'badiraguato', 'culiacán', 'elota', 'escuinapa', 'mazatlán', 'navolato', 'rosario', 'salvador alvarado', 'sinaloa', 'san ignacio', 'choix'],
        Sonora: ['agua prieta', 'alamos', 'benjamín hill', 'caborca', 'cananea', 'cajeme', 'carbó', 'fronteras', 'general plutarco elías calles', 'granados', 'guaymas', 'hermosillo', 'huachinera', 'hueribampo', 'la colorada', 'magdalena', 'mauricio castillo', 'nogales', 'navojoa', 'pitiquito', 'plutarco elías calles', 'populonia', 'querobabi', 'san ignacio río muerto', 'san luis río colorado', 'soyopa', 'tekopora', 'tepache', 'trinchera', 'urias', 'vélez', 'villa hidalgo'],
        Tabasco: ['balancán', 'centrales', 'centla', 'humildad', 'nacajuca', 'naltepec', 'pantanos de centla', 'paraíso', 'teapa', 'tenosique'],
        Tamaulipas: ['altamira', 'antiguo morelos', 'burgos', 'casas', 'cierro azul', 'crucero', 'el mante', 'el mezquital', 'gonzález', 'guerrero', 'güémez', 'hernán cortes', 'jaumave', 'llera', 'matamoros', 'mante', 'miguel alemán', 'miquihuana', 'nuevo morelos', 'nuevo laredo', 'padilla', 'panales', 'reynosa', 'rio bravo', 'san carlos', 'san fernando', 'san nicolás', 'soto la marina', 'tampico', 'tula', 'valle hermoso', 'victoria', 'villa de casas', 'villagrán'],
        Tlaxcala: ['acalco', 'apetatitlán de antonio carvajal', 'apizaco', 'atlangatepec', 'atltzayanca', 'benito juárez', 'calpulalpan', 'chapulco', 'huamantla', 'ixmiquilpan', 'lapaz', 'lazaro cardenas', 'mazatecochco', 'momoxpan', 'panotla', 'papalotla de xicohténcatl', 'puebla', 'sanctorum de lazo', 'san pablo apatlaco', 'san pablo del monte', 'tenancingo', 'teolocholco', 'tepeyanco', 'tequexquitla', 'tizatlán', 'tlaxcala', 'xaloztoc', 'xaltocan', 'yauhquemecan', 'zacatelco'],
        Veracruz: ['acajete', 'acultzingo', 'actopan', 'agua dulce', 'alvarado', 'amelia', 'amoltepec', 'apazapan', 'aquíles serdán', 'atzacuapan', 'boca del río', 'calcahualco', 'carrillo puerto', 'catemaco', 'coatzacoalcos', 'coatepec', 'cosoleacaque', 'cotaxtla', 'cuichapa', 'córdoba', 'cosamaloapan', 'chacaltianguis', 'chalchicomula de sesma', 'chalchihuites', 'chalma', 'chiconamel', 'chicontepec', 'chietla', 'chihuitán', 'choapas', 'chocholtepec', 'chontla', 'chucantla', 'churumuco', 'clavellinas', 'coacoatzintla', 'coatepec', 'coatepec de hinojosa', 'cosamaloapan', 'cosautlán', 'cosautlán de carvajal', 'coscomatepec', 'cuitláhuac', 'cuichapa', 'cuitláhuac', 'el higo', 'hidalgotitlán', 'huayacocotla', 'hueyapan', 'jesús carranza', 'josé maría morelos', 'juquila', 'juchique de ferrer', 'landero y coss', 'las minas', 'las minas de opichén', 'las minitas', 'las rosas', 'las vegas', 'la perla', 'mecatlán', 'mingua', 'minatitlán', 'mixtla', 'molango', 'nanchital', 'naranjos', 'naranjos amatlán', 'naranjos amatlán', 'pajapan', 'papantla', 'paracho', 'pánuco', 'pánuco', 'perote', 'pozarica', 'pueblo viejo', 'pueblo viejo', 'puente nacional', 'pueblo viejo', 'pueblo nuevo', 'rio blanco', 'san andrés tuxtla', 'san juan evangelista', 'san martín', 'san martín', 'san pablo', 'san rafael', 'santa ana atzacan', 'santiago tuxtla', 'santiago tuxtla', 'santiago tuxtla', 'santiago tuxtla', 'santiago tuxtla', 'tamalín', 'tamalín', 'tamiahua', 'tempoal', 'texistepec', 'tierra blanca', 'tlacojalpan', 'tlatlauquitepec', 'tuxpan', 'tuzamapan de galeana', 'velasco', 'veracruz', 'xalapa', 'xico', 'yacatepec', 'yecuatla', 'yochistlahuaca', 'zacualpan', 'zamora'],
        Yucatán: ['acanceh', 'acapulco', 'axochiapan', 'cacalchén', 'calkiní', 'cantamayec', 'celestún', 'cenotillo', 'chankom', 'chapab', 'chapab', 'chapab', 'chapab', 'chicxulub', 'chichimilá', 'chichimilá', 'chichimilá', 'chicxulub puerto', 'chuay' 'chumayel', 'conkal', 'copó', 'dzán', 'dzidzantún', 'dzilam de bravo', 'dzilam gonzález', 'dzilam', 'dzitás', 'dzitás', 'dzoncauich', 'dzonot', 'dzoncauich', 'dzonot', 'dzonot', 'dzonot', 'dzonot', 'dzonot', 'dzonot', 'dzonot', 'dzonot', 'dzonot', 'dzonot', 'dzonot', 'dzonot', 'dzonot'],
        Zacatecas: ['aladins', 'apulco', 'calera', 'fresnillo', 'genaro codina', 'jerez', 'jiménez del teúl', 'juan aldama', 'máscaras', 'melchor ocampo', 'mezcala de la asunción', 'momax', 'monte escobedo', 'morelos', 'nochistlán', 'ojocaliente', 'pánfilo natera', 'pedro escobedo', 'pinos', 'río grande', 'saín alto', 'teúl de gómez', 'trinidad', 'valparaíso', 'villanueva', 'zacatecas']
    };

    function mostrarEstados() {
        const Estado_republica = document.getElementById('Estado_republica').value;
        const centro_trabajoSelect = document.getElementById('Centro_trabajo');
        const centro_trabajoContainer = document.getElementById('centro_trabajoContainer');

        // Limpiar opciones anteriores
        centro_trabajoSelect.innerHTML = '<option value="">-- Selecciona un estado/provincia --</option>';

        if (Estado_republica && municipios_estado[Estado_republica]) {
            // Mostrar el contenedor
            centro_trabajoContainer.style.display = 'block';

            // Agregar nuevas opciones
            municipios_estado[Estado_republica].forEach(function (Centro_trabajo) {
                const option = document.createElement('option');
                option.value = Centro_trabajo.toLowerCase().replace(/\s/g, '-');
                option.textContent = Centro_trabajo;
                centro_trabajoSelect.appendChild(option);
            });
        } else {
            // Ocultar si no hay país seleccionado
            centro_trabajoContainer.style.display = 'none';
        }
    };

    // Inicia formulario
    updateStepDisplay();

    // funcion del botón siguiente
    nextBtn.addEventListener('click', function () {
        if (validateStep(currentStep)) {
            if (currentStep === 1) {
                updateEquipmentList();
            } else if (currentStep === 3) {
                updateSummary();
            }

            if (currentStep < 4) {
                currentStep++;
                updateStepDisplay();
            } else {
                // Reemplazar el submit por la nueva funcion
                submitForm();
            }
        }
        //Obtener el email del input
        getEmailInput();
    });

    // función del boton de atrás
    backBtn.addEventListener('click', function () {
        if (currentStep > 0) {
            currentStep--;
            updateStepDisplay();
        }
    });

    // cambio de servicios
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const atLeastOneChecked = Array.from(serviceCheckboxes).some(cb => cb.checked);
            nextBtn.disabled = !atLeastOneChecked;
        });
    });

    // Actualizar la vista del formulario
    function updateStepDisplay() {
        // actualiza los menus
        stepMenus.forEach((menu, index) => {
            if (index === currentStep) {
                menu.classList.add('active');
            } else {
                menu.classList.remove('active');
            }
        });
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // funcion del boton
        backBtn.style.display = currentStep > 0 ? 'block' : 'none';

        if (currentStep === 4) {
            nextBtn.textContent = 'Enviar';
        } else {
            nextBtn.textContent = 'Siguiente';
            nextBtn.disabled = currentStep === 1 && !Array.from(serviceCheckboxes).some(cb => cb.checked);
        }

        // Scroll
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // función de los servicios
    function updateEquipmentList() {
        const selectedServices = Array.from(serviceCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        let equipmentHTML = '';
        const uniqueEquipment = new Set();

        selectedServices.forEach(service => {
            if (equipmentOptions[service]) {
                equipmentOptions[service].forEach(item => uniqueEquipment.add(item));
            }
        });

        if (uniqueEquipment.size > 0) {
            uniqueEquipment.forEach(item => {
                equipmentHTML += `
                            <div class="crs-checkbox-group">
                                <label class="crs-checkbox-label">
                                    <input type="checkbox" name="equipamiento[]" value="${item}" class="crs-checkbox-input"> ${item}
                                </label>
                            </div>
                        `;
            });
        } else {
            equipmentHTML = '<p>No se requieren equipamientos especiales para los servicios seleccionados</p>';
        }

        equipmentList.innerHTML = equipmentHTML;
    }

    // Opciones de equipamiento
    const equipmentOptions = {
        'Guardias Seguridad': ['Raso', 'Ejecutivo', 'Jefe de servicio', 'Jefe de turno', 'Acomodo de personal', 'Uniforme adicional*',
            'Auto patrulla', 'Camioneta con batea', 'Motocicleta', 'Ambulancia', 'Celular', 'Radio', 'Caninos',
            'Papeleria y computo'],
        'Protección personal': ['Raso', 'Ejecutivo', 'Jefe de servicio', 'Jefe de turno', 'Acomodo de personal', 'Uniforme adicional*',
            'Auto patrulla', 'Camioneta con batea', 'Motocicleta', 'Ambulancia', 'Celular', 'Radio', 'Caninos',
            'Papeleria y computo'],
        'Seguridad patrimonial': ['Tactico', 'Jefe de servicio', 'Jefe de turno', 'Acomodo de personal', 'Uniforme adicional*',
            'Auto patrulla', 'Camioneta con batea', 'Motocicleta', 'Ambulancia', 'Celular', 'Radio', 'Caninos',
            'Papeleria y computo'],
        'Custodia mercancia': ['Tactico', 'Ejecutivo', 'Jefe de servicio', 'Jefe de turno', 'Acomodo de personal', 'Uniforme adicional*',
            'Auto patrulla', 'Camioneta con batea', 'Motocicleta', 'Ambulancia', 'Celular', 'Radio', 'Caninos',
            'Papeleria y computo'],
    };
    // Resumen de la información
    function updateSummary() {
        const formData = new FormData(form);
        let summaryHTML = `
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #001550; margin-bottom: 10px;">Información del cliente</h4>
                        <p><strong>Nombre:</strong> ${formData.get('Nombre')}</p>
                        <p><strong>Empresa:</strong> ${formData.get('Empresa')}</p>
                        <p><strong>Contacto:</strong> ${formData.get('Email')} | ${formData.get('Telefono')}</p>
                        <p><strong>Dirección:</strong> ${formData.get('direccion_Empresa')}</p>
                        <p><strong>Cargo:</strong> ${formData.get('Cargo_Ocupacional')}</p>
                        <p><strong>WhatsApp:</strong> ${formData.get('whatsapp')}</p>   
                        <p><strong>Descripción de la empresa:</strong> ${formData.get('descripcion_Empresa')}</p>
                    </div>
                `;

        // Resumen de tipo de servicio
        const SelectTurno = formData.get('SelectTurno');
        if (SelectTurno) {
            summaryHTML += `
                        <div>
                            <h4 style="color: #001550; margin-bottom: 10px;">Tipo de turno</h4>
                            <p>${SelectTurno}</p>
                        </div>
                    `;
        }

        // Resumen de numero de guardias
        const numGuardia = formData.get('num_guardias');
        if (numGuardia) {
            summaryHTML += `
                        <div>
                            <h4 style="color: #001550; margin-bottom: 10px;">Numero de guardias</h4>
                            <p>${numGuardia}</p>
                        </div>
                    `;
        }

        // resumen de servicios
        const services = formData.getAll('servicios[]');
        if (services.length > 0) {
            summaryHTML += `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #001550; margin-bottom: 10px;">Servicios solicitados</h4>
                            <ul style="padding-left: 20px;">
                                ${services.map(service => `<li>${service}</li>`).join('')}
                            </ul>
                        </div>
                    `;
        }

        // resumen de equipamiento
        const equipment = formData.getAll('equipamiento[]');
        if (equipment.length > 0) {
            summaryHTML += `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #001550; margin-bottom: 10px;">Equipamiento requerido</h4>
                            <ul style="padding-left: 20px;">
                                ${equipment.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    `;
        }

        // comentarios adicionales
        const comments = formData.get('comentarios');
        if (comments) {
            summaryHTML += `
                        <div>
                            <h4 style="color: #001550; margin-bottom: 10px;">Comentarios adicionales</h4>
                            <p>${comments}</p>
                        </div>
                    `;
        }

        summaryDetails.innerHTML = summaryHTML;
    }


    document.getElementById('visita-btn')?.addEventListener('click', function () {
        alert('Solicitud de visita enviada. Nos pondremos en contacto para coordinar la visita.');
        // form.submit();
    });

    document.getElementById('meet-btn')?.addEventListener('click', function () {
        alert('Solicitud de reunión virtual enviada. Recibirá un enlace para la reunión por correo electrónico.');
        // form.submit();
    });

    document.getElementById('cita-btn')?.addEventListener('click', function () {
        alert('Solicitud de cita enviada. Nos pondremos en contacto para confirmar la fecha y hora.');
        // form.submit();
    });

    // Validación del formulario
    function validateStep(step) {
        let isValid = true;

        if (step === 0) {
            // Validacion de los campos del formulario
            const requiredFields = ['Nombre', 'destinatario', 'puesto', 'asunto'];
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    field.style.borderColor = 'red';
                    isValid = false;
                } else {
                    field.style.borderColor = '#DDE3EC';
                }
            });

            if (!isValid) {
                alert('Por favor complete todos los campos requeridos');
            }
        }

        return isValid;
    }
    //se van agregar más datos al localStorage
    function getEmailInput(){
        let input = document.querySelector('#Email');

        // Guardar en localStorage cuando el usuario termine de escribir
        input.addEventListener('blur', function () {
            localStorage.setItem('emailUsuario', input.value);
            // console.log('Email guardado en localStorage:', input.value);
        });
}

    //función para mostrar los modales
    function submitForm() {
        Swal.fire({
            title: 'Enviando su solicitud...',
            text: 'Por favor, espere un momento.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const formData = new FormData(form);

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json' 
            }
        })
        .then(response => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json();
            } else {
                throw new TypeError("No se recibió una respuesta JSON válida del servidor.");
            }
        })
        .then(data => {
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro Exitoso! ✅',
                    text: data.message,
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = 'http://localhost/nxg_cotizacion/menu.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error ❌',
                    text: data.message || 'Hubo un problema al enviar el registro. Inténtelo de nuevo.',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión 🌐',
                text: 'No se pudo conectar con el servidor. Por favor, revise su conexión a internet.',
                confirmButtonText: 'Aceptar'
            });
        });
    }
    
});