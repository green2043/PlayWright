import { showToast } from './common.js';
const form = document.getElementById('mega-form');
const asyncBtn = document.getElementById('asyncActionBtn');
const asyncResult = document.getElementById('asyncActionResult');
const formResult = document.getElementById('formSubmitResult');
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    if (formResult)
        formResult.textContent = 'Form submitted successfully!';
    showToast('Form submitted successfully!', 'success');
});
asyncBtn?.addEventListener('click', () => {
    if (asyncResult)
        asyncResult.textContent = 'Loading...';
    asyncBtn.disabled = true;
    setTimeout(() => {
        if (asyncResult)
            asyncResult.textContent = 'Async action completed!';
        asyncBtn.disabled = false;
        showToast('Async action completed', 'info');
    }, 1500);
});
// Complete list of world countries (ISO-ish codes) with international dial codes.
const ALL_COUNTRIES = [
    { code: 'af', name: 'Afghanistan', phonePrefix: '+93' },
    { code: 'al', name: 'Albania', phonePrefix: '+355' },
    { code: 'dz', name: 'Algeria', phonePrefix: '+213' },
    { code: 'ad', name: 'Andorra', phonePrefix: '+376' },
    { code: 'ao', name: 'Angola', phonePrefix: '+244' },
    { code: 'ag', name: 'Antigua and Barbuda', phonePrefix: '+1268' },
    { code: 'ar', name: 'Argentina', phonePrefix: '+54' },
    { code: 'am', name: 'Armenia', phonePrefix: '+374' },
    { code: 'au', name: 'Australia', phonePrefix: '+61' },
    { code: 'at', name: 'Austria', phonePrefix: '+43' },
    { code: 'az', name: 'Azerbaijan', phonePrefix: '+994' },
    { code: 'bs', name: 'Bahamas', phonePrefix: '+1242' },
    { code: 'bh', name: 'Bahrain', phonePrefix: '+973' },
    { code: 'bd', name: 'Bangladesh', phonePrefix: '+880' },
    { code: 'bb', name: 'Barbados', phonePrefix: '+1246' },
    { code: 'by', name: 'Belarus', phonePrefix: '+375' },
    { code: 'be', name: 'Belgium', phonePrefix: '+32' },
    { code: 'bz', name: 'Belize', phonePrefix: '+501' },
    { code: 'bj', name: 'Benin', phonePrefix: '+229' },
    { code: 'bt', name: 'Bhutan', phonePrefix: '+975' },
    { code: 'bo', name: 'Bolivia', phonePrefix: '+591' },
    { code: 'ba', name: 'Bosnia and Herzegovina', phonePrefix: '+387' },
    { code: 'bw', name: 'Botswana', phonePrefix: '+267' },
    { code: 'br', name: 'Brazil', phonePrefix: '+55' },
    { code: 'bn', name: 'Brunei', phonePrefix: '+673' },
    { code: 'bg', name: 'Bulgaria', phonePrefix: '+359' },
    { code: 'bf', name: 'Burkina Faso', phonePrefix: '+226' },
    { code: 'bi', name: 'Burundi', phonePrefix: '+257' },
    { code: 'cv', name: 'Cabo Verde', phonePrefix: '+238' },
    { code: 'kh', name: 'Cambodia', phonePrefix: '+855' },
    { code: 'cm', name: 'Cameroon', phonePrefix: '+237' },
    { code: 'ca', name: 'Canada', phonePrefix: '+1' },
    { code: 'cf', name: 'Central African Republic', phonePrefix: '+236' },
    { code: 'td', name: 'Chad', phonePrefix: '+235' },
    { code: 'cl', name: 'Chile', phonePrefix: '+56' },
    { code: 'cn', name: 'China', phonePrefix: '+86' },
    { code: 'co', name: 'Colombia', phonePrefix: '+57' },
    { code: 'km', name: 'Comoros', phonePrefix: '+269' },
    { code: 'cg', name: 'Congo', phonePrefix: '+242' },
    { code: 'cd', name: 'Congo (DRC)', phonePrefix: '+243' },
    { code: 'cr', name: 'Costa Rica', phonePrefix: '+506' },
    { code: 'ci', name: "Côte d'Ivoire", phonePrefix: '+225' },
    { code: 'hr', name: 'Croatia', phonePrefix: '+385' },
    { code: 'cu', name: 'Cuba', phonePrefix: '+53' },
    { code: 'cy', name: 'Cyprus', phonePrefix: '+357' },
    { code: 'cz', name: 'Czechia', phonePrefix: '+420' },
    { code: 'dk', name: 'Denmark', phonePrefix: '+45' },
    { code: 'dj', name: 'Djibouti', phonePrefix: '+253' },
    { code: 'dm', name: 'Dominica', phonePrefix: '+1767' },
    { code: 'do', name: 'Dominican Republic', phonePrefix: '+1809' },
    { code: 'ec', name: 'Ecuador', phonePrefix: '+593' },
    { code: 'eg', name: 'Egypt', phonePrefix: '+20' },
    { code: 'sv', name: 'El Salvador', phonePrefix: '+503' },
    { code: 'gq', name: 'Equatorial Guinea', phonePrefix: '+240' },
    { code: 'er', name: 'Eritrea', phonePrefix: '+291' },
    { code: 'ee', name: 'Estonia', phonePrefix: '+372' },
    { code: 'sz', name: 'Eswatini', phonePrefix: '+268' },
    { code: 'et', name: 'Ethiopia', phonePrefix: '+251' },
    { code: 'fj', name: 'Fiji', phonePrefix: '+679' },
    { code: 'fi', name: 'Finland', phonePrefix: '+358' },
    { code: 'fr', name: 'France', phonePrefix: '+33' },
    { code: 'ga', name: 'Gabon', phonePrefix: '+241' },
    { code: 'gm', name: 'Gambia', phonePrefix: '+220' },
    { code: 'ge', name: 'Georgia', phonePrefix: '+995' },
    { code: 'de', name: 'Germany', phonePrefix: '+49' },
    { code: 'gh', name: 'Ghana', phonePrefix: '+233' },
    { code: 'gr', name: 'Greece', phonePrefix: '+30' },
    { code: 'gd', name: 'Grenada', phonePrefix: '+1473' },
    { code: 'gt', name: 'Guatemala', phonePrefix: '+502' },
    { code: 'gn', name: 'Guinea', phonePrefix: '+224' },
    { code: 'gw', name: 'Guinea-Bissau', phonePrefix: '+245' },
    { code: 'gy', name: 'Guyana', phonePrefix: '+592' },
    { code: 'ht', name: 'Haiti', phonePrefix: '+509' },
    { code: 'hn', name: 'Honduras', phonePrefix: '+504' },
    { code: 'hu', name: 'Hungary', phonePrefix: '+36' },
    { code: 'is', name: 'Iceland', phonePrefix: '+354' },
    { code: 'in', name: 'India', phonePrefix: '+91' },
    { code: 'id', name: 'Indonesia', phonePrefix: '+62' },
    { code: 'ir', name: 'Iran', phonePrefix: '+98' },
    { code: 'iq', name: 'Iraq', phonePrefix: '+964' },
    { code: 'ie', name: 'Ireland', phonePrefix: '+353' },
    { code: 'il', name: 'Israel', phonePrefix: '+972' },
    { code: 'it', name: 'Italy', phonePrefix: '+39' },
    { code: 'jm', name: 'Jamaica', phonePrefix: '+1876' },
    { code: 'jp', name: 'Japan', phonePrefix: '+81' },
    { code: 'jo', name: 'Jordan', phonePrefix: '+962' },
    { code: 'kz', name: 'Kazakhstan', phonePrefix: '+7' },
    { code: 'ke', name: 'Kenya', phonePrefix: '+254' },
    { code: 'ki', name: 'Kiribati', phonePrefix: '+686' },
    { code: 'kw', name: 'Kuwait', phonePrefix: '+965' },
    { code: 'kg', name: 'Kyrgyzstan', phonePrefix: '+996' },
    { code: 'la', name: 'Laos', phonePrefix: '+856' },
    { code: 'lv', name: 'Latvia', phonePrefix: '+371' },
    { code: 'lb', name: 'Lebanon', phonePrefix: '+961' },
    { code: 'ls', name: 'Lesotho', phonePrefix: '+266' },
    { code: 'lr', name: 'Liberia', phonePrefix: '+231' },
    { code: 'ly', name: 'Libya', phonePrefix: '+218' },
    { code: 'li', name: 'Liechtenstein', phonePrefix: '+423' },
    { code: 'lt', name: 'Lithuania', phonePrefix: '+370' },
    { code: 'lu', name: 'Luxembourg', phonePrefix: '+352' },
    { code: 'mg', name: 'Madagascar', phonePrefix: '+261' },
    { code: 'mw', name: 'Malawi', phonePrefix: '+265' },
    { code: 'my', name: 'Malaysia', phonePrefix: '+60' },
    { code: 'mv', name: 'Maldives', phonePrefix: '+960' },
    { code: 'ml', name: 'Mali', phonePrefix: '+223' },
    { code: 'mt', name: 'Malta', phonePrefix: '+356' },
    { code: 'mh', name: 'Marshall Islands', phonePrefix: '+692' },
    { code: 'mr', name: 'Mauritania', phonePrefix: '+222' },
    { code: 'mu', name: 'Mauritius', phonePrefix: '+230' },
    { code: 'mx', name: 'Mexico', phonePrefix: '+52' },
    { code: 'fm', name: 'Micronesia', phonePrefix: '+691' },
    { code: 'md', name: 'Moldova', phonePrefix: '+373' },
    { code: 'mc', name: 'Monaco', phonePrefix: '+377' },
    { code: 'mn', name: 'Mongolia', phonePrefix: '+976' },
    { code: 'me', name: 'Montenegro', phonePrefix: '+382' },
    { code: 'ma', name: 'Morocco', phonePrefix: '+212' },
    { code: 'mz', name: 'Mozambique', phonePrefix: '+258' },
    { code: 'mm', name: 'Myanmar', phonePrefix: '+95' },
    { code: 'na', name: 'Namibia', phonePrefix: '+264' },
    { code: 'nr', name: 'Nauru', phonePrefix: '+674' },
    { code: 'np', name: 'Nepal', phonePrefix: '+977' },
    { code: 'nl', name: 'Netherlands', phonePrefix: '+31' },
    { code: 'nz', name: 'New Zealand', phonePrefix: '+64' },
    { code: 'ni', name: 'Nicaragua', phonePrefix: '+505' },
    { code: 'ne', name: 'Niger', phonePrefix: '+227' },
    { code: 'ng', name: 'Nigeria', phonePrefix: '+234' },
    { code: 'kp', name: 'North Korea', phonePrefix: '+850' },
    { code: 'mk', name: 'North Macedonia', phonePrefix: '+389' },
    { code: 'no', name: 'Norway', phonePrefix: '+47' },
    { code: 'om', name: 'Oman', phonePrefix: '+968' },
    { code: 'pk', name: 'Pakistan', phonePrefix: '+92' },
    { code: 'pw', name: 'Palau', phonePrefix: '+680' },
    { code: 'pa', name: 'Panama', phonePrefix: '+507' },
    { code: 'pg', name: 'Papua New Guinea', phonePrefix: '+675' },
    { code: 'py', name: 'Paraguay', phonePrefix: '+595' },
    { code: 'pe', name: 'Peru', phonePrefix: '+51' },
    { code: 'ph', name: 'Philippines', phonePrefix: '+63' },
    { code: 'pl', name: 'Poland', phonePrefix: '+48' },
    { code: 'pt', name: 'Portugal', phonePrefix: '+351' },
    { code: 'qa', name: 'Qatar', phonePrefix: '+974' },
    { code: 'ro', name: 'Romania', phonePrefix: '+40' },
    { code: 'ru', name: 'Russia', phonePrefix: '+7' },
    { code: 'rw', name: 'Rwanda', phonePrefix: '+250' },
    { code: 'kn', name: 'Saint Kitts and Nevis', phonePrefix: '+1869' },
    { code: 'lc', name: 'Saint Lucia', phonePrefix: '+1758' },
    { code: 'vc', name: 'Saint Vincent and the Grenadines', phonePrefix: '+1784' },
    { code: 'ws', name: 'Samoa', phonePrefix: '+685' },
    { code: 'sm', name: 'San Marino', phonePrefix: '+378' },
    { code: 'st', name: 'Sao Tome and Principe', phonePrefix: '+239' },
    { code: 'sa', name: 'Saudi Arabia', phonePrefix: '+966' },
    { code: 'sn', name: 'Senegal', phonePrefix: '+221' },
    { code: 'rs', name: 'Serbia', phonePrefix: '+381' },
    { code: 'sc', name: 'Seychelles', phonePrefix: '+248' },
    { code: 'sl', name: 'Sierra Leone', phonePrefix: '+232' },
    { code: 'sg', name: 'Singapore', phonePrefix: '+65' },
    { code: 'sk', name: 'Slovakia', phonePrefix: '+421' },
    { code: 'si', name: 'Slovenia', phonePrefix: '+386' },
    { code: 'sb', name: 'Solomon Islands', phonePrefix: '+677' },
    { code: 'so', name: 'Somalia', phonePrefix: '+252' },
    { code: 'za', name: 'South Africa', phonePrefix: '+27' },
    { code: 'kr', name: 'South Korea', phonePrefix: '+82' },
    { code: 'ss', name: 'South Sudan', phonePrefix: '+211' },
    { code: 'es', name: 'Spain', phonePrefix: '+34' },
    { code: 'lk', name: 'Sri Lanka', phonePrefix: '+94' },
    { code: 'sd', name: 'Sudan', phonePrefix: '+249' },
    { code: 'sr', name: 'Suriname', phonePrefix: '+597' },
    { code: 'se', name: 'Sweden', phonePrefix: '+46' },
    { code: 'ch', name: 'Switzerland', phonePrefix: '+41' },
    { code: 'sy', name: 'Syria', phonePrefix: '+963' },
    { code: 'tw', name: 'Taiwan', phonePrefix: '+886' },
    { code: 'tj', name: 'Tajikistan', phonePrefix: '+992' },
    { code: 'tz', name: 'Tanzania', phonePrefix: '+255' },
    { code: 'th', name: 'Thailand', phonePrefix: '+66' },
    { code: 'tl', name: 'Timor-Leste', phonePrefix: '+670' },
    { code: 'tg', name: 'Togo', phonePrefix: '+228' },
    { code: 'to', name: 'Tonga', phonePrefix: '+676' },
    { code: 'tt', name: 'Trinidad and Tobago', phonePrefix: '+1868' },
    { code: 'tn', name: 'Tunisia', phonePrefix: '+216' },
    { code: 'tr', name: 'Turkey', phonePrefix: '+90' },
    { code: 'tm', name: 'Turkmenistan', phonePrefix: '+993' },
    { code: 'tv', name: 'Tuvalu', phonePrefix: '+688' },
    { code: 'ug', name: 'Uganda', phonePrefix: '+256' },
    { code: 'ua', name: 'Ukraine', phonePrefix: '+380' },
    { code: 'ae', name: 'United Arab Emirates', phonePrefix: '+971' },
    { code: 'uk', name: 'United Kingdom', phonePrefix: '+44' },
    { code: 'us', name: 'United States', phonePrefix: '+1' },
    { code: 'uy', name: 'Uruguay', phonePrefix: '+598' },
    { code: 'uz', name: 'Uzbekistan', phonePrefix: '+998' },
    { code: 'vu', name: 'Vanuatu', phonePrefix: '+678' },
    { code: 'va', name: 'Vatican City', phonePrefix: '+379' },
    { code: 've', name: 'Venezuela', phonePrefix: '+58' },
    { code: 'vn', name: 'Vietnam', phonePrefix: '+84' },
    { code: 'ye', name: 'Yemen', phonePrefix: '+967' },
    { code: 'zm', name: 'Zambia', phonePrefix: '+260' },
    { code: 'zw', name: 'Zimbabwe', phonePrefix: '+263' },
];
// Detailed state/city/pincode sample data for a broad set of major countries,
// used to power cascading State -> City dropdowns and PIN/ZIP auto-detection.
const LOCATION_DATA = [
    {
        code: 'us', name: 'United States', phonePrefix: '+1',
        states: [
            { name: 'California', cities: [
                    { name: 'Los Angeles', pincodes: ['90001', '90002', '90003'] },
                    { name: 'San Francisco', pincodes: ['94102', '94103'] },
                ] },
            { name: 'New York', cities: [
                    { name: 'New York City', pincodes: ['10001', '10002', '10003'] },
                    { name: 'Buffalo', pincodes: ['14201', '14202'] },
                ] },
        ],
    },
    {
        code: 'in', name: 'India', phonePrefix: '+91',
        states: [
            { name: 'Andhra Pradesh', cities: [
                    { name: 'Visakhapatnam', pincodes: ['530001', '530002', '530003'] },
                    { name: 'Vijayawada', pincodes: ['520001', '520002', '520003'] },
                    { name: 'Guntur', pincodes: ['522001', '522002'] },
                    { name: 'Nellore', pincodes: ['524001', '524002'] },
                    { name: 'Tirupati', pincodes: ['517501', '517502'] },
                    { name: 'Kakinada', pincodes: ['533001'] },
                    { name: 'Kadapa', pincodes: ['516001'] },
                ] },
            { name: 'Arunachal Pradesh', cities: [
                    { name: 'Itanagar', pincodes: ['791111', '791110'] },
                    { name: 'Tawang', pincodes: ['790104'] },
                    { name: 'Naharlagun', pincodes: ['791110'] },
                    { name: 'Pasighat', pincodes: ['791102'] },
                ] },
            { name: 'Assam', cities: [
                    { name: 'Guwahati', pincodes: ['781001', '781003', '781005'] },
                    { name: 'Dibrugarh', pincodes: ['786001', '786003'] },
                    { name: 'Silchar', pincodes: ['788001'] },
                    { name: 'Jorhat', pincodes: ['785001'] },
                    { name: 'Nagaon', pincodes: ['782001'] },
                    { name: 'Tezpur', pincodes: ['784001'] },
                ] },
            { name: 'Bihar', cities: [
                    { name: 'Patna', pincodes: ['800001', '800002', '800008'] },
                    { name: 'Gaya', pincodes: ['823001', '823002'] },
                    { name: 'Bhagalpur', pincodes: ['812001'] },
                    { name: 'Muzaffarpur', pincodes: ['842001'] },
                    { name: 'Darbhanga', pincodes: ['846001'] },
                    { name: 'Purnia', pincodes: ['854301'] },
                ] },
            { name: 'Chhattisgarh', cities: [
                    { name: 'Raipur', pincodes: ['492001', '492002', '492010'] },
                    { name: 'Bilaspur', pincodes: ['495001', '495003'] },
                    { name: 'Durg', pincodes: ['491001'] },
                    { name: 'Bhilai', pincodes: ['490001'] },
                    { name: 'Korba', pincodes: ['495677'] },
                ] },
            { name: 'Goa', cities: [
                    { name: 'Panaji', pincodes: ['403001', '403002'] },
                    { name: 'Margao', pincodes: ['403601', '403602'] },
                    { name: 'Vasco da Gama', pincodes: ['403802'] },
                    { name: 'Mapusa', pincodes: ['403507'] },
                ] },
            { name: 'Gujarat', cities: [
                    { name: 'Ahmedabad', pincodes: ['380001', '380002', '380015'] },
                    { name: 'Surat', pincodes: ['395001', '395002', '395003'] },
                    { name: 'Vadodara', pincodes: ['390001', '390002'] },
                    { name: 'Rajkot', pincodes: ['360001', '360002'] },
                    { name: 'Bhavnagar', pincodes: ['364001'] },
                    { name: 'Jamnagar', pincodes: ['361001'] },
                    { name: 'Gandhinagar', pincodes: ['382001'] },
                ] },
            { name: 'Haryana', cities: [
                    { name: 'Gurugram', pincodes: ['122001', '122002', '122018'] },
                    { name: 'Faridabad', pincodes: ['121001', '121002'] },
                    { name: 'Panipat', pincodes: ['132103'] },
                    { name: 'Ambala', pincodes: ['134001'] },
                    { name: 'Hisar', pincodes: ['125001'] },
                    { name: 'Karnal', pincodes: ['132001'] },
                ] },
            { name: 'Himachal Pradesh', cities: [
                    { name: 'Shimla', pincodes: ['171001', '171002'] },
                    { name: 'Manali', pincodes: ['175131'] },
                    { name: 'Dharamshala', pincodes: ['176215'] },
                    { name: 'Solan', pincodes: ['173212'] },
                    { name: 'Kullu', pincodes: ['175101'] },
                ] },
            { name: 'Jharkhand', cities: [
                    { name: 'Ranchi', pincodes: ['834001', '834002', '834009'] },
                    { name: 'Jamshedpur', pincodes: ['831001', '831002'] },
                    { name: 'Dhanbad', pincodes: ['826001'] },
                    { name: 'Bokaro', pincodes: ['827001'] },
                    { name: 'Hazaribagh', pincodes: ['825301'] },
                ] },
            { name: 'Karnataka', cities: [
                    { name: 'Bengaluru', pincodes: ['560001', '560002', '560034', '560068', '560095', '560100'] },
                    { name: 'Mysuru', pincodes: ['570001', '570002'] },
                    { name: 'Mangaluru', pincodes: ['575001', '575002'] },
                    { name: 'Hubballi', pincodes: ['580001'] },
                    { name: 'Belagavi', pincodes: ['590001'] },
                    { name: 'Davanagere', pincodes: ['577001'] },
                    { name: 'Shivamogga', pincodes: ['577201'] },
                ] },
            { name: 'Kerala', cities: [
                    { name: 'Thiruvananthapuram', pincodes: ['695001', '695002', '695014'] },
                    { name: 'Kochi', pincodes: ['682001', '682002', '682016'] },
                    { name: 'Kozhikode', pincodes: ['673001', '673002'] },
                    { name: 'Thrissur', pincodes: ['680001'] },
                    { name: 'Kollam', pincodes: ['691001'] },
                    { name: 'Alappuzha', pincodes: ['688001'] },
                    { name: 'Kannur', pincodes: ['670001'] },
                ] },
            { name: 'Madhya Pradesh', cities: [
                    { name: 'Bhopal', pincodes: ['462001', '462002', '462016'] },
                    { name: 'Indore', pincodes: ['452001', '452002', '452010'] },
                    { name: 'Gwalior', pincodes: ['474001', '474002'] },
                    { name: 'Jabalpur', pincodes: ['482001'] },
                    { name: 'Ujjain', pincodes: ['456001'] },
                    { name: 'Sagar', pincodes: ['470001'] },
                ] },
            { name: 'Maharashtra', cities: [
                    { name: 'Mumbai', pincodes: ['400001', '400002', '400003', '400050', '400070', '400097'] },
                    { name: 'Pune', pincodes: ['411001', '411002', '411014', '411045'] },
                    { name: 'Nagpur', pincodes: ['440001', '440002'] },
                    { name: 'Nashik', pincodes: ['422001', '422002'] },
                    { name: 'Aurangabad', pincodes: ['431001'] },
                    { name: 'Solapur', pincodes: ['413001'] },
                    { name: 'Thane', pincodes: ['400601', '400602'] },
                    { name: 'Kolhapur', pincodes: ['416001'] },
                ] },
            { name: 'Manipur', cities: [
                    { name: 'Imphal', pincodes: ['795001', '795004'] },
                    { name: 'Thoubal', pincodes: ['795138'] },
                    { name: 'Churachandpur', pincodes: ['795128'] },
                ] },
            { name: 'Meghalaya', cities: [
                    { name: 'Shillong', pincodes: ['793001', '793003'] },
                    { name: 'Tura', pincodes: ['794001'] },
                    { name: 'Jowai', pincodes: ['793150'] },
                ] },
            { name: 'Mizoram', cities: [
                    { name: 'Aizawl', pincodes: ['796001', '796005'] },
                    { name: 'Lunglei', pincodes: ['796701'] },
                ] },
            { name: 'Nagaland', cities: [
                    { name: 'Kohima', pincodes: ['797001', '797002'] },
                    { name: 'Dimapur', pincodes: ['797112', '797113'] },
                    { name: 'Mokokchung', pincodes: ['798601'] },
                ] },
            { name: 'Odisha', cities: [
                    { name: 'Bhubaneswar', pincodes: [
                            '751001', '751002', '751003', '751004', '751005',
                            '751006', '751007', '751009', '751010', '751012',
                            '751013', '751014', '751015', '751016', '751017',
                            '751018', '751019', '751020', '751021', '751022',
                            '751023', '751024', '751025', '751026', '751027',
                            '751028', '751029', '751030', '751031', '751032',
                            '751033', '751034', '751035',
                        ] },
                    { name: 'Cuttack', pincodes: ['753001', '753002'] },
                    { name: 'Rourkela', pincodes: ['769001'] },
                    { name: 'Berhampur', pincodes: ['760001'] },
                    { name: 'Sambalpur', pincodes: [
                            '768001', '768002', '768003', '768004', '768005',
                            '768006', '768009', '768014', '768015', '768016',
                            '768017', '768018', '768019', '768020', '768025',
                            '768028', '768100', '768118',
                        ] },
                ] },
            { name: 'Punjab', cities: [
                    { name: 'Amritsar', pincodes: ['143001', '143002'] },
                    { name: 'Ludhiana', pincodes: ['141001', '141002', '141008'] },
                    { name: 'Jalandhar', pincodes: ['144001', '144002'] },
                    { name: 'Patiala', pincodes: ['147001'] },
                    { name: 'Bathinda', pincodes: ['151001'] },
                    { name: 'Mohali', pincodes: ['160055', '160062'] },
                ] },
            { name: 'Rajasthan', cities: [
                    { name: 'Jaipur', pincodes: ['302001', '302002', '302015', '302017'] },
                    { name: 'Udaipur', pincodes: ['313001', '313002'] },
                    { name: 'Jodhpur', pincodes: ['342001', '342003'] },
                    { name: 'Kota', pincodes: ['324001'] },
                    { name: 'Ajmer', pincodes: ['305001'] },
                    { name: 'Bikaner', pincodes: ['334001'] },
                    { name: 'Alwar', pincodes: ['301001'] },
                ] },
            { name: 'Sikkim', cities: [
                    { name: 'Gangtok', pincodes: ['737101', '737102'] },
                    { name: 'Namchi', pincodes: ['737126'] },
                    { name: 'Gyalshing', pincodes: ['737111'] },
                ] },
            { name: 'Tamil Nadu', cities: [
                    { name: 'Chennai', pincodes: ['600001', '600002', '600028', '600040', '600096'] },
                    { name: 'Coimbatore', pincodes: ['641001', '641002', '641012'] },
                    { name: 'Madurai', pincodes: ['625001', '625002'] },
                    { name: 'Tiruchirappalli', pincodes: ['620001'] },
                    { name: 'Salem', pincodes: ['636001'] },
                    { name: 'Tirunelveli', pincodes: ['627001'] },
                    { name: 'Erode', pincodes: ['638001'] },
                    { name: 'Vellore', pincodes: ['632001'] },
                ] },
            { name: 'Telangana', cities: [
                    { name: 'Hyderabad', pincodes: ['500001', '500002', '500034', '500081'] },
                    { name: 'Warangal', pincodes: ['506001', '506002'] },
                    { name: 'Nizamabad', pincodes: ['503001'] },
                    { name: 'Karimnagar', pincodes: ['505001'] },
                    { name: 'Khammam', pincodes: ['507001'] },
                ] },
            { name: 'Tripura', cities: [
                    { name: 'Agartala', pincodes: ['799001', '799002'] },
                    { name: 'Udaipur (Tripura)', pincodes: ['799120'] },
                    { name: 'Dharmanagar', pincodes: ['799250'] },
                ] },
            { name: 'Uttar Pradesh', cities: [
                    { name: 'Lucknow', pincodes: ['226001', '226002', '226010'] },
                    { name: 'Kanpur', pincodes: ['208001', '208002'] },
                    { name: 'Varanasi', pincodes: ['221001', '221002'] },
                    { name: 'Agra', pincodes: ['282001', '282002'] },
                    { name: 'Prayagraj', pincodes: ['211001'] },
                    { name: 'Ghaziabad', pincodes: ['201001', '201002'] },
                    { name: 'Noida', pincodes: ['201301', '201304'] },
                    { name: 'Meerut', pincodes: ['250001'] },
                    { name: 'Bareilly', pincodes: ['243001'] },
                    { name: 'Gorakhpur', pincodes: ['273001'] },
                ] },
            { name: 'Uttarakhand', cities: [
                    { name: 'Dehradun', pincodes: ['248001', '248002'] },
                    { name: 'Haridwar', pincodes: ['249401', '249404'] },
                    { name: 'Rishikesh', pincodes: ['249201'] },
                    { name: 'Nainital', pincodes: ['263001'] },
                    { name: 'Haldwani', pincodes: ['263139'] },
                ] },
            { name: 'West Bengal', cities: [
                    { name: 'Kolkata', pincodes: ['700001', '700002', '700016', '700091'] },
                    { name: 'Howrah', pincodes: ['711101', '711102'] },
                    { name: 'Darjeeling', pincodes: ['734101', '734102'] },
                    { name: 'Siliguri', pincodes: ['734001'] },
                    { name: 'Durgapur', pincodes: ['713201'] },
                    { name: 'Asansol', pincodes: ['713301'] },
                ] },
            { name: 'Andaman and Nicobar Islands', cities: [
                    { name: 'Port Blair', pincodes: ['744101', '744102'] },
                    { name: 'Diglipur', pincodes: ['744202'] },
                ] },
            { name: 'Chandigarh', cities: [
                    { name: 'Chandigarh', pincodes: ['160001', '160002', '160017', '160036'] },
                ] },
            { name: 'Dadra and Nagar Haveli and Daman and Diu', cities: [
                    { name: 'Daman', pincodes: ['396210', '396215'] },
                    { name: 'Silvassa', pincodes: ['396230'] },
                    { name: 'Diu', pincodes: ['362520'] },
                ] },
            { name: 'Delhi', cities: [
                    { name: 'New Delhi', pincodes: ['110001', '110002', '110011'] },
                    { name: 'Dwarka', pincodes: ['110075', '110078'] },
                    { name: 'Rohini', pincodes: ['110085'] },
                    { name: 'Karol Bagh', pincodes: ['110005'] },
                    { name: 'Saket', pincodes: ['110017'] },
                ] },
            { name: 'Jammu and Kashmir', cities: [
                    { name: 'Srinagar', pincodes: ['190001', '190002'] },
                    { name: 'Jammu', pincodes: ['180001', '180002'] },
                    { name: 'Anantnag', pincodes: ['192101'] },
                    { name: 'Baramulla', pincodes: ['193101'] },
                ] },
            { name: 'Ladakh', cities: [
                    { name: 'Leh', pincodes: ['194101'] },
                    { name: 'Kargil', pincodes: ['194103'] },
                ] },
            { name: 'Lakshadweep', cities: [
                    { name: 'Kavaratti', pincodes: ['682555'] },
                    { name: 'Agatti', pincodes: ['682553'] },
                ] },
            { name: 'Puducherry', cities: [
                    { name: 'Puducherry', pincodes: ['605001', '605004'] },
                    { name: 'Karaikal', pincodes: ['609602'] },
                ] },
        ],
    },
    {
        code: 'uk', name: 'United Kingdom', phonePrefix: '+44',
        states: [
            { name: 'England', cities: [
                    { name: 'London', pincodes: ['E1', 'EC1', 'W1'] },
                    { name: 'Manchester', pincodes: ['M1', 'M2'] },
                ] },
            { name: 'Scotland', cities: [
                    { name: 'Edinburgh', pincodes: ['EH1', 'EH2'] },
                    { name: 'Glasgow', pincodes: ['G1', 'G2'] },
                ] },
        ],
    },
    {
        code: 'ca', name: 'Canada', phonePrefix: '+1',
        states: [
            { name: 'Ontario', cities: [
                    { name: 'Toronto', pincodes: ['M5H', 'M5J'] },
                    { name: 'Ottawa', pincodes: ['K1A', 'K1P'] },
                ] },
            { name: 'British Columbia', cities: [
                    { name: 'Vancouver', pincodes: ['V5K', 'V6B'] },
                    { name: 'Victoria', pincodes: ['V8W'] },
                ] },
        ],
    },
    {
        code: 'au', name: 'Australia', phonePrefix: '+61',
        states: [
            { name: 'New South Wales', cities: [
                    { name: 'Sydney', pincodes: ['2000', '2001'] },
                    { name: 'Newcastle', pincodes: ['2300'] },
                ] },
            { name: 'Victoria', cities: [
                    { name: 'Melbourne', pincodes: ['3000', '3001'] },
                    { name: 'Geelong', pincodes: ['3220'] },
                ] },
        ],
    },
    {
        code: 'de', name: 'Germany', phonePrefix: '+49',
        states: [
            { name: 'Bavaria', cities: [
                    { name: 'Munich', pincodes: ['80331', '80333'] },
                    { name: 'Nuremberg', pincodes: ['90402'] },
                ] },
            { name: 'Berlin', cities: [
                    { name: 'Berlin', pincodes: ['10115', '10117'] },
                ] },
        ],
    },
    {
        code: 'fr', name: 'France', phonePrefix: '+33',
        states: [
            { name: 'Île-de-France', cities: [
                    { name: 'Paris', pincodes: ['75001', '75002'] },
                    { name: 'Versailles', pincodes: ['78000'] },
                ] },
            { name: 'Provence-Alpes-Côte d\'Azur', cities: [
                    { name: 'Marseille', pincodes: ['13001', '13002'] },
                    { name: 'Nice', pincodes: ['06000'] },
                ] },
        ],
    },
    {
        code: 'jp', name: 'Japan', phonePrefix: '+81',
        states: [
            { name: 'Tokyo', cities: [
                    { name: 'Shinjuku', pincodes: ['160-0022', '160-0023'] },
                    { name: 'Shibuya', pincodes: ['150-0002'] },
                ] },
            { name: 'Osaka', cities: [
                    { name: 'Osaka City', pincodes: ['530-0001', '530-0002'] },
                ] },
        ],
    },
    {
        code: 'cn', name: 'China', phonePrefix: '+86',
        states: [
            { name: 'Beijing', cities: [
                    { name: 'Chaoyang', pincodes: ['100020', '100021'] },
                ] },
            { name: 'Shanghai', cities: [
                    { name: 'Pudong', pincodes: ['200120', '200121'] },
                ] },
        ],
    },
    {
        code: 'br', name: 'Brazil', phonePrefix: '+55',
        states: [
            { name: 'São Paulo', cities: [
                    { name: 'São Paulo City', pincodes: ['01000-000', '01001-000'] },
                    { name: 'Campinas', pincodes: ['13010-000'] },
                ] },
            { name: 'Rio de Janeiro', cities: [
                    { name: 'Rio de Janeiro City', pincodes: ['20000-000'] },
                ] },
        ],
    },
    {
        code: 'za', name: 'South Africa', phonePrefix: '+27',
        states: [
            { name: 'Gauteng', cities: [
                    { name: 'Johannesburg', pincodes: ['2000', '2001'] },
                    { name: 'Pretoria', pincodes: ['0002'] },
                ] },
            { name: 'Western Cape', cities: [
                    { name: 'Cape Town', pincodes: ['8000', '8001'] },
                ] },
        ],
    },
    {
        code: 'ae', name: 'United Arab Emirates', phonePrefix: '+971',
        states: [
            { name: 'Dubai', cities: [
                    { name: 'Dubai City', pincodes: ['00000'] },
                ] },
            { name: 'Abu Dhabi', cities: [
                    { name: 'Abu Dhabi City', pincodes: ['11111'] },
                ] },
        ],
    },
    {
        code: 'sg', name: 'Singapore', phonePrefix: '+65',
        states: [
            { name: 'Central Region', cities: [
                    { name: 'Singapore', pincodes: ['238823', '238824'] },
                ] },
        ],
    },
    {
        code: 'mx', name: 'Mexico', phonePrefix: '+52',
        states: [
            { name: 'Mexico City', cities: [
                    { name: 'Ciudad de México', pincodes: ['01000', '01001'] },
                ] },
            { name: 'Jalisco', cities: [
                    { name: 'Guadalajara', pincodes: ['44100'] },
                ] },
        ],
    },
    {
        code: 'it', name: 'Italy', phonePrefix: '+39',
        states: [
            { name: 'Lazio', cities: [
                    { name: 'Rome', pincodes: ['00100', '00118'] },
                ] },
            { name: 'Lombardy', cities: [
                    { name: 'Milan', pincodes: ['20121', '20122'] },
                ] },
        ],
    },
];
const addrCountry = document.getElementById('addrCountry');
const addrState = document.getElementById('addrState');
const addrCity = document.getElementById('addrCity');
const addrPincode = document.getElementById('addrPincode');
const phonePrefix = document.getElementById('phonePrefix');
const addrDetectResult = document.getElementById('addrDetectResult');
function populateCountries() {
    if (!addrCountry)
        return;
    for (const country of ALL_COUNTRIES) {
        const opt = document.createElement('option');
        opt.value = country.code;
        opt.textContent = country.name;
        addrCountry.appendChild(opt);
    }
}
function populateStates(countryCode, selectState) {
    if (!addrState)
        return;
    addrState.innerHTML = '<option value="">-- Select a state --</option>';
    const country = LOCATION_DATA.find(c => c.code === countryCode);
    if (!country) {
        addrState.innerHTML = '<option value="">-- Detailed data not available for this country --</option>';
        addrState.disabled = true;
        return;
    }
    for (const state of country.states) {
        const opt = document.createElement('option');
        opt.value = state.name;
        opt.textContent = state.name;
        addrState.appendChild(opt);
    }
    addrState.disabled = false;
    if (selectState)
        addrState.value = selectState;
}
function populateCities(countryCode, stateName, selectCity) {
    if (!addrCity)
        return;
    addrCity.innerHTML = '<option value="">-- Select a city --</option>';
    const country = LOCATION_DATA.find(c => c.code === countryCode);
    const state = country?.states.find(s => s.name === stateName);
    if (!state) {
        addrCity.disabled = true;
        return;
    }
    for (const city of state.cities) {
        const opt = document.createElement('option');
        opt.value = city.name;
        opt.textContent = city.name;
        addrCity.appendChild(opt);
    }
    addrCity.disabled = false;
    if (selectCity)
        addrCity.value = selectCity;
}
function setPhonePrefix(countryCode) {
    if (!phonePrefix)
        return;
    const country = ALL_COUNTRIES.find(c => c.code === countryCode);
    phonePrefix.value = country ? country.phonePrefix : '';
}
populateCountries();
addrCountry?.addEventListener('change', () => {
    const code = addrCountry.value;
    if (!code) {
        if (addrState) {
            addrState.innerHTML = '<option value="">-- Select a state --</option>';
            addrState.disabled = true;
        }
        if (addrCity) {
            addrCity.innerHTML = '<option value="">-- Select a city --</option>';
            addrCity.disabled = true;
        }
        if (phonePrefix)
            phonePrefix.value = '';
        return;
    }
    populateStates(code);
    if (addrCity) {
        addrCity.innerHTML = '<option value="">-- Select a city --</option>';
        addrCity.disabled = true;
    }
    setPhonePrefix(code);
});
addrState?.addEventListener('change', () => {
    const code = addrCountry?.value ?? '';
    const stateName = addrState.value;
    if (!code || !stateName) {
        if (addrCity) {
            addrCity.innerHTML = '<option value="">-- Select a city --</option>';
            addrCity.disabled = true;
        }
        return;
    }
    populateCities(code, stateName);
});
addrPincode?.addEventListener('input', () => {
    const value = addrPincode.value.trim();
    if (!value) {
        if (addrDetectResult)
            addrDetectResult.textContent = '';
        return;
    }
    for (const country of LOCATION_DATA) {
        for (const state of country.states) {
            for (const city of state.cities) {
                const match = city.pincodes.find(p => p.toLowerCase().startsWith(value.toLowerCase()));
                if (match) {
                    if (addrCountry)
                        addrCountry.value = country.code;
                    populateStates(country.code, state.name);
                    populateCities(country.code, state.name, city.name);
                    setPhonePrefix(country.code);
                    if (addrDetectResult) {
                        addrDetectResult.textContent = `Detected: ${city.name}, ${state.name}, ${country.name} (${country.phonePrefix})`;
                    }
                    return;
                }
            }
        }
    }
    if (addrDetectResult)
        addrDetectResult.textContent = 'No matching location found for this PIN/ZIP code.';
});
const MOCK_USERS = [
    { id: 1, name: 'Aarav Sharma', role: 'QA Engineer' },
    { id: 2, name: 'Satya Narayan', role: 'SDET' },
    { id: 3, name: 'Priya Patel', role: 'Automation Lead' },
    { id: 4, name: 'John Doe', role: 'Manual Tester' },
    { id: 5, name: 'Emma Wilson', role: 'Test Architect' },
];
const loadUsersBtn = document.getElementById('loadUsersBtn');
const ajaxUserSelect = document.getElementById('ajaxUserSelect');
const ajaxUsersSpinner = document.getElementById('ajaxUsersSpinner');
loadUsersBtn?.addEventListener('click', () => {
    if (ajaxUsersSpinner)
        ajaxUsersSpinner.hidden = false;
    loadUsersBtn.disabled = true;
    if (ajaxUserSelect) {
        ajaxUserSelect.innerHTML = '<option value="">Loading users...</option>';
    }
    // Simulated AJAX GET request latency.
    setTimeout(() => {
        if (ajaxUserSelect) {
            ajaxUserSelect.innerHTML = '<option value="">-- Select a user --</option>';
            for (const user of MOCK_USERS) {
                const opt = document.createElement('option');
                opt.value = String(user.id);
                opt.textContent = `${user.name} (${user.role})`;
                opt.setAttribute('data-testid', `ajax-user-option-${user.id}`);
                ajaxUserSelect.appendChild(opt);
            }
            ajaxUserSelect.disabled = false;
        }
        if (ajaxUsersSpinner)
            ajaxUsersSpinner.hidden = true;
        loadUsersBtn.disabled = false;
        showToast('User directory loaded', 'success');
    }, 1200);
});
const MOCK_CITIES = [
    { name: 'London', country: 'United Kingdom' },
    { name: 'Los Angeles', country: 'United States' },
    { name: 'Paris', country: 'France' },
    { name: 'Prague', country: 'Czechia' },
    { name: 'Tokyo', country: 'Japan' },
    { name: 'Toronto', country: 'Canada' },
];
const ajaxSearchInput = document.getElementById('ajaxSearchInput');
const ajaxSearchResults = document.getElementById('ajaxSearchResults');
let ajaxSearchDebounceTimer;
ajaxSearchInput?.addEventListener('input', () => {
    const query = ajaxSearchInput.value.trim().toLowerCase();
    if (ajaxSearchDebounceTimer)
        window.clearTimeout(ajaxSearchDebounceTimer);
    if (!query) {
        if (ajaxSearchResults)
            ajaxSearchResults.innerHTML = '';
        return;
    }
    if (ajaxSearchResults) {
        ajaxSearchResults.innerHTML = '<div class="ajax-search-loading" data-testid="ajax-search-loading">Searching...</div>';
    }
    // Debounce: wait 400ms after the user stops typing before "calling the API".
    ajaxSearchDebounceTimer = window.setTimeout(() => {
        const matches = MOCK_CITIES.filter(c => c.name.toLowerCase().includes(query));
        if (!ajaxSearchResults)
            return;
        ajaxSearchResults.innerHTML = '';
        if (matches.length === 0) {
            ajaxSearchResults.innerHTML = '<div class="ajax-search-no-results" data-testid="ajax-search-no-results">No matching cities found.</div>';
            return;
        }
        for (const city of matches) {
            const item = document.createElement('div');
            item.className = 'ajax-search-result-item';
            item.textContent = `${city.name}, ${city.country}`;
            item.setAttribute('id', `ajax-search-item-${city.name.toLowerCase().replace(/\s+/g, '-')}`);
            item.setAttribute('data-testid', `ajax-search-item-${city.name.toLowerCase().replace(/\s+/g, '-')}`);
            item.setAttribute('role', 'option');
            item.addEventListener('click', () => {
                if (ajaxSearchInput)
                    ajaxSearchInput.value = city.name;
                ajaxSearchResults.innerHTML = '';
            });
            ajaxSearchResults.appendChild(item);
        }
    }, 400);
});
const MOCK_WEATHER = {
    in: { tempC: 32, condition: 'Sunny', icon: '☀️' },
    us: { tempC: 21, condition: 'Cloudy', icon: '☁️' },
    uk: { tempC: 15, condition: 'Rainy', icon: '🌧️' },
    jp: { tempC: 26, condition: 'Partly Cloudy', icon: '⛅' },
    au: { tempC: 28, condition: 'Clear', icon: '🌤️' },
};
const ajaxWeatherCountry = document.getElementById('ajaxWeatherCountry');
const ajaxWeatherResult = document.getElementById('ajaxWeatherResult');
ajaxWeatherCountry?.addEventListener('change', () => {
    const code = ajaxWeatherCountry.value;
    if (!ajaxWeatherResult)
        return;
    if (!code) {
        ajaxWeatherResult.innerHTML = '<span class="ajax-weather-placeholder">Select a country to fetch weather...</span>';
        return;
    }
    ajaxWeatherResult.innerHTML = '<span class="spinner" data-testid="ajax-weather-spinner" aria-label="Loading weather"></span> Fetching weather...';
    // Simulated fetch-on-change AJAX latency.
    setTimeout(() => {
        const weather = MOCK_WEATHER[code];
        if (!weather || !ajaxWeatherResult)
            return;
        ajaxWeatherResult.innerHTML = `
      <span class="ajax-weather-icon" data-testid="ajax-weather-icon">${weather.icon}</span>
      <span class="ajax-weather-temp" data-testid="ajax-weather-temp">${weather.tempC}&deg;C</span>
      <span data-testid="ajax-weather-condition">${weather.condition}</span>
    `;
    }, 900);
});
/* ============================================================
   Bootstrap-Style Dropdowns
   Plain-JS re-implementation of Bootstrap's dropdown toggle
   behaviour (no Bootstrap JS bundle dependency): clicking a
   [data-bs-toggle="dropdown"] button shows/hides its sibling
   .dropdown-menu, toggles aria-expanded, and closes on an outside
   click or Escape - matching what learners would expect from real
   Bootstrap dropdowns for Playwright practice.
   ============================================================ */
function closeAllDropdownMenus(except) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu === except)
            return;
        menu.hidden = true;
        const toggle = document.getElementById(menu.getAttribute('aria-labelledby') ?? '');
        toggle?.setAttribute('aria-expanded', 'false');
    });
}
document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = toggle.parentElement?.querySelector('.dropdown-menu');
        if (!menu)
            return;
        const isOpen = !menu.hidden;
        closeAllDropdownMenus();
        menu.hidden = isOpen;
        toggle.setAttribute('aria-expanded', String(!isOpen));
        if (!isOpen) {
            const searchInput = menu.querySelector('.dropdown-search-input');
            searchInput?.focus();
        }
    });
});
document.addEventListener('click', () => closeAllDropdownMenus());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape')
    closeAllDropdownMenus(); });
// 1) Action Menu dropdown - single-choice action list.
const actionDropdownResult = document.getElementById('actionDropdownResult');
document.querySelectorAll('#actionDropdownMenu .dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
        const label = item.textContent?.trim() ?? '';
        const value = item.getAttribute('data-value') ?? '';
        if (actionDropdownResult)
            actionDropdownResult.textContent = `You chose: ${label} (value="${value}")`;
        closeAllDropdownMenus();
        showToast(`Action selected: ${label}`, 'info');
    });
});
// 2) Preferred Language dropdown - single-select radio-style menu.
const languageDropdownToggle = document.getElementById('languageDropdownToggle');
const languageDropdownValue = document.getElementById('languageDropdownValue');
document.querySelectorAll('#languageDropdownMenu .dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('#languageDropdownMenu .dropdown-item').forEach(i => {
            i.classList.remove('active');
            i.setAttribute('aria-checked', 'false');
        });
        item.classList.add('active');
        item.setAttribute('aria-checked', 'true');
        const label = item.textContent?.trim() ?? '';
        if (languageDropdownToggle)
            languageDropdownToggle.textContent = label;
        if (languageDropdownValue)
            languageDropdownValue.value = item.getAttribute('data-value') ?? '';
        closeAllDropdownMenus();
    });
});
// 3) Skills Filter dropdown - multi-select checkbox menu that stays open on
// each individual checkbox click, only updating the toggle button's count.
const skillsDropdownToggle = document.getElementById('skillsDropdownToggle');
document.querySelectorAll('#skillsDropdownMenu input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('click', (e) => e.stopPropagation());
    checkbox.addEventListener('change', () => {
        const checkedCount = document.querySelectorAll('#skillsDropdownMenu input[type="checkbox"]:checked').length;
        if (skillsDropdownToggle)
            skillsDropdownToggle.textContent = `${checkedCount} skill${checkedCount === 1 ? '' : 's'} selected`;
    });
});
// 4) Searchable Country dropdown - filterable list built from ALL_COUNTRIES.
const searchableDropdownToggle = document.getElementById('searchableDropdownToggle');
const searchableDropdownInput = document.getElementById('searchableDropdownInput');
const searchableDropdownList = document.getElementById('searchableDropdownList');
function renderSearchableCountryList(filter = '') {
    if (!searchableDropdownList)
        return;
    const query = filter.trim().toLowerCase();
    const matches = ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(query));
    searchableDropdownList.innerHTML = '';
    if (matches.length === 0) {
        const li = document.createElement('li');
        li.className = 'dropdown-no-results';
        li.textContent = 'No matching countries.';
        li.setAttribute('data-testid', 'searchable-dropdown-no-results');
        searchableDropdownList.appendChild(li);
        return;
    }
    for (const country of matches.slice(0, 30)) {
        const li = document.createElement('li');
        li.textContent = country.name;
        li.setAttribute('role', 'option');
        li.setAttribute('id', `searchable-country-option-${country.code}`);
        li.setAttribute('data-testid', `searchable-country-option-${country.code}`);
        li.setAttribute('data-value', country.code);
        li.addEventListener('click', () => {
            if (searchableDropdownToggle)
                searchableDropdownToggle.textContent = country.name;
            closeAllDropdownMenus();
        });
        searchableDropdownList.appendChild(li);
    }
}
renderSearchableCountryList();
searchableDropdownInput?.addEventListener('click', (e) => e.stopPropagation());
searchableDropdownInput?.addEventListener('input', () => renderSearchableCountryList(searchableDropdownInput.value));
// 5) Tech Stack native <select multiple> - a REAL <select>/<option> element
// (unlike the checkbox/menu-based dropdowns above), so Playwright's native
// locator.selectOption([...]) API works directly against it. Includes a
// few duplicate <option> elements (same text and/or same value) for
// practising strict-mode locator disambiguation.
const techStackMultiSelect = document.getElementById('techStackMultiSelect');
const techStackMultiSelectResult = document.getElementById('techStackMultiSelectResult');
techStackMultiSelect?.addEventListener('change', () => {
    const selected = Array.from(techStackMultiSelect.selectedOptions).map(opt => opt.textContent?.trim());
    if (techStackMultiSelectResult) {
        techStackMultiSelectResult.textContent = selected.length
            ? `Selected: ${selected.join(', ')}`
            : '';
    }
});
const JOB_TITLES = [
    { value: 'developer', label: 'Developer' },
    { value: 'qa', label: 'QA' },
    { value: 'devops', label: 'DevOps' },
    { value: 're', label: 'RE' },
    { value: 'doc-engg', label: 'Doc Engg.' },
    { value: 'ui-ux-dev', label: 'UI/UX Dev' },
    { value: 'ai-ml-expert', label: 'AI/ML Expert' },
    { value: 'ai-ml-developer', label: 'AI ML Developer' },
    { value: 'ba', label: 'BA' },
];
const jobTitleToggle = document.getElementById('jobTitleDropdownToggle');
const jobTitleToggleInput = jobTitleToggle?.querySelector('.oxd-select-text-input');
const jobTitleWrapper = document.getElementById('jobTitleDropdownWrapper');
const jobTitleValueInput = document.getElementById('jobTitleDropdownValue');
let jobTitleMenuEl = null;
function closeJobTitleMenu() {
    if (jobTitleMenuEl) {
        jobTitleMenuEl.remove(); // fully removed from the DOM, not just hidden
        jobTitleMenuEl = null;
        jobTitleToggle?.setAttribute('aria-expanded', 'false');
    }
}
function openJobTitleMenu() {
    if (jobTitleMenuEl || !jobTitleWrapper || !jobTitleToggle)
        return;
    // div/span-based option list, mirroring OrangeHRM's
    // div.oxd-select-dropdown > div.oxd-select-option markup.
    const menu = document.createElement('div');
    menu.className = 'oxd-select-dropdown';
    menu.id = 'jobTitleDropdownMenu';
    menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-labelledby', 'jobTitleDropdownToggle');
    menu.setAttribute('data-testid', 'menu-job-title-dropdown');
    for (const job of JOB_TITLES) {
        const option = document.createElement('div');
        option.className = 'oxd-select-option';
        option.setAttribute('role', 'option');
        option.setAttribute('data-value', job.value);
        option.setAttribute('data-testid', `dropdown-item-job-title-${job.value}`);
        option.tabIndex = 0;
        const span = document.createElement('span');
        span.textContent = job.label;
        option.appendChild(span);
        option.addEventListener('click', () => {
            if (jobTitleToggleInput)
                jobTitleToggleInput.textContent = job.label;
            if (jobTitleValueInput)
                jobTitleValueInput.value = job.value;
            closeJobTitleMenu();
        });
        menu.appendChild(option);
    }
    jobTitleWrapper.appendChild(menu);
    jobTitleMenuEl = menu;
    jobTitleToggle.setAttribute('aria-expanded', 'true');
}
jobTitleToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (jobTitleMenuEl) {
        closeJobTitleMenu();
    }
    else {
        closeAllDropdownMenus();
        openJobTitleMenu();
    }
});
jobTitleToggle?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (jobTitleMenuEl) {
            closeJobTitleMenu();
        }
        else {
            closeAllDropdownMenus();
            openJobTitleMenu();
        }
    }
});
// Close on any outside LEFT click (normal Bootstrap-style outside-click-to-close).
document.addEventListener('click', (e) => {
    if (jobTitleMenuEl && jobTitleWrapper && !jobTitleWrapper.contains(e.target)) {
        closeJobTitleMenu();
    }
});
// Close as soon as the page/window itself loses focus. Right-clicking to open the
// browser's context menu (or DevTools stealing focus via F12/Inspect) fires a window
// "blur" event, so the menu is removed from the DOM right as that happens - UNLESS
// DevTools has "Emulate a focused page" enabled (Ctrl+Shift+P), which suppresses the
// blur and lets the element survive long enough to be selected in the Elements panel.
// NOTE: there is intentionally NO mouseleave-based close here - only blur triggers an
// automatic close (besides picking an item, clicking outside, or Escape) - so that
// "Emulate a focused page" is the ONLY reliable way to inspect the menu's real markup.
window.addEventListener('blur', () => {
    closeJobTitleMenu();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape')
        closeJobTitleMenu();
});
//# sourceMappingURL=forms.js.map