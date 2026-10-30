/* =========================================================
   12Help! — Dados fictícios da demonstração
   Todas as organizações, pessoas, projetos e valores são inventados.
   ========================================================= */

const CATS = {
  amb:{n:'Meio ambiente',i:'leaf',g:['#00703A','#2FB36A']},
  edu:{n:'Educação',i:'book',g:['#0F4C81','#4A86C2']},
  sau:{n:'Saúde',i:'heart',g:['#A8324F','#E07A8F']},
  ani:{n:'Animais',i:'paw',g:['#9A6A12','#D9A441']},
  ali:{n:'Alimentação',i:'utensils',g:['#B8541E','#E9925A']},
  ass:{n:'Assistência social',i:'users',g:['#5B4596','#9C86D2']},
  cul:{n:'Cultura',i:'palette',g:['#9C2F6E','#D873AE']},
  dh:{n:'Direitos humanos',i:'scale',g:['#24456E','#5E83B5']},
  tec:{n:'Tecnologia',i:'cpu',g:['#0B6577','#3DB3C9']},
  emg:{n:'Emergências humanitárias',i:'lifebuoy',g:['#A3332B','#E3765E']}
};

const CAUSES = [
  ['amb','Meio ambiente','leaf',['amb']],
  ['edu','Educação','book',['edu']],
  ['ani','Proteção animal','paw',['ani']],
  ['sau','Saúde','heart',['sau']],
  ['fome','Combate à fome','utensils',['ali']],
  ['dh','Direitos humanos','scale',['dh']],
  ['inc','Inclusão social','users',['ass','dh']],
  ['cul','Cultura e arte','palette',['cul']],
  ['ido','Apoio a idosos','heart',['ass','sau']],
  ['hum','Ajuda humanitária','lifebuoy',['emg','ali']],
  ['esp','Esportes','trophy',['edu','ass']],
  ['tec','Tecnologia e inovação social','cpu',['tec']],
  ['cri','Proteção de crianças e adolescentes','smile',['edu','dh']],
  ['com','Desenvolvimento comunitário','home',['ass','amb']]
].map(([k,n,i,cats])=>({k,n,i,cats}));

const COUNTRIES = {
  BR:{n:'Brasil',f:'🇧🇷'},AR:{n:'Argentina',f:'🇦🇷'},CL:{n:'Chile',f:'🇨🇱'},US:{n:'Estados Unidos',f:'🇺🇸'},
  CA:{n:'Canadá',f:'🇨🇦'},PT:{n:'Portugal',f:'🇵🇹'},FR:{n:'França',f:'🇫🇷'},DE:{n:'Alemanha',f:'🇩🇪'},
  JP:{n:'Japão',f:'🇯🇵'},ZA:{n:'África do Sul',f:'🇿🇦'},IN:{n:'Índia',f:'🇮🇳'},AU:{n:'Austrália',f:'🇦🇺'}
};

const ONGS = [
  {id:'raizes',name:'Instituto Raízes Verdes',ini:'RV',c:'#008C45',country:'BR',state:'SC',city:'Joinville',lat:-26.30,lng:-48.85,cat:'amb',founded:2014,vols:1240,rating:4.9,verified:true,site:'raizesverdes.org (fictício)',tagline:'Reflorestamento urbano e educação ambiental na Mata Atlântica.',desc:'Recuperamos áreas degradadas da Mata Atlântica no norte catarinense com mutirões de plantio, viveiros comunitários e educação ambiental em escolas públicas. Já são mais de 86 mil mudas nativas plantadas com a ajuda de voluntários.'},
  {id:'saber',name:'Rede Saber Mais',ini:'SM',c:'#0F4C81',country:'BR',state:'SP',city:'São Paulo',lat:-23.55,lng:-46.63,cat:'edu',founded:2011,vols:3420,rating:4.8,verified:true,site:'sabermais.org (fictício)',tagline:'Reforço escolar e mentoria para estudantes da rede pública.',desc:'Conectamos voluntários a estudantes de escolas públicas da Grande São Paulo para reforço escolar, mentoria de carreira e clubes de leitura. Atuamos presencialmente e online.'},
  {id:'patas',name:'Patas Unidas',ini:'PU',c:'#B7791F',country:'BR',state:'RJ',city:'Rio de Janeiro',lat:-22.91,lng:-43.17,cat:'ani',founded:2016,vols:890,rating:4.7,verified:true,site:'patasunidas.org (fictício)',tagline:'Resgate, reabilitação e adoção responsável de cães e gatos.',desc:'Mantemos um abrigo para 180 animais resgatados na zona norte do Rio, com programas de castração, feiras de adoção e educação para guarda responsável.'},
  {id:'mesa',name:'Mesa Cheia',ini:'MC',c:'#C05621',country:'BR',state:'PE',city:'Recife',lat:-8.05,lng:-34.88,cat:'ali',founded:2018,vols:1560,rating:4.9,verified:true,site:'mesacheia.org (fictício)',tagline:'Cozinhas solidárias e combate ao desperdício de alimentos.',desc:'Resgatamos alimentos de feiras e supermercados e os transformamos em refeições nutritivas para famílias em situação de insegurança alimentar na Região Metropolitana do Recife.'},
  {id:'amazonia',name:'Amazônia Viva',ini:'AV',c:'#1F7A4D',country:'BR',state:'AM',city:'Manaus',lat:-3.12,lng:-60.02,cat:'amb',founded:2009,vols:720,rating:4.8,verified:true,site:'amazoniaviva.org (fictício)',tagline:'Monitoramento de rios e apoio a comunidades ribeirinhas.',desc:'Trabalhamos com comunidades ribeirinhas do Rio Negro em monitoramento ambiental, manejo sustentável e geração de renda a partir da floresta em pé.'},
  {id:'aurora',name:'Casa Aurora',ini:'CA',c:'#6B46C1',country:'BR',state:'MG',city:'Belo Horizonte',lat:-19.92,lng:-43.94,cat:'ass',founded:2012,vols:410,rating:4.9,verified:true,site:'casaaurora.org (fictício)',tagline:'Convivência, afeto e autonomia para pessoas idosas.',desc:'Centro de convivência que oferece atividades culturais, inclusão digital e acompanhamento afetivo a mais de 300 pessoas idosas em Belo Horizonte.'},
  {id:'codigo',name:'Código do Bem',ini:'CB',c:'#0E7490',country:'BR',state:'PR',city:'Curitiba',lat:-25.43,lng:-49.27,cat:'tec',founded:2019,vols:980,rating:4.8,verified:true,site:'codigodobem.dev (fictício)',tagline:'Tecnologia a serviço de quem transforma.',desc:'Comunidade de desenvolvedores e designers que cria soluções digitais gratuitas para organizações sociais e ensina programação para adolescentes.'},
  {id:'mar',name:'Mar de Cultura',ini:'MD',c:'#B83280',country:'BR',state:'BA',city:'Salvador',lat:-12.97,lng:-38.50,cat:'cul',founded:2013,vols:530,rating:4.7,verified:true,site:'mardecultura.org (fictício)',tagline:'Arte, música e memória afro-brasileira.',desc:'Promovemos oficinas de percussão, dança e audiovisual para jovens dos bairros periféricos de Salvador, valorizando a cultura afro-brasileira.'},
  {id:'saudeRede',name:'Saúde em Rede',ini:'SR',c:'#C53030',country:'BR',state:'CE',city:'Fortaleza',lat:-3.73,lng:-38.52,cat:'sau',founded:2015,vols:640,rating:4.6,verified:true,site:'saudeemrede.org (fictício)',tagline:'Prevenção e acolhimento em saúde comunitária.',desc:'Formamos agentes comunitários voluntários e mantemos um serviço de escuta e acolhimento emocional por teleatendimento.'},
  {id:'abrigoSul',name:'Abrigo Sul',ini:'AS',c:'#9B2C2C',country:'BR',state:'RS',city:'Porto Alegre',lat:-30.03,lng:-51.23,cat:'emg',founded:2024,vols:2870,rating:4.9,verified:true,site:'abrigosul.org (fictício)',tagline:'Resposta rápida a enchentes e desastres climáticos.',desc:'Nascemos durante as enchentes de 2024 e hoje coordenamos abrigos emergenciais, logística de doações e reconstrução de moradias no Rio Grande do Sul.'},
  {id:'patagonia',name:'Fundación Costa Limpia',ini:'CL',c:'#2B6CB0',country:'AR',state:'',city:'Buenos Aires',lat:-34.60,lng:-58.38,cat:'amb',founded:2010,vols:1120,rating:4.7,verified:true,site:'costalimpia.org.ar (fictício)',tagline:'Rios e costas livres de plástico.',desc:'Organizamos mutirões de limpeza no Río de la Plata e na costa atlântica argentina, com coleta de dados sobre resíduos para políticas públicas.'},
  {id:'manos',name:'Manos al Norte',ini:'MN',c:'#975A16',country:'CL',state:'',city:'Santiago',lat:-33.45,lng:-70.67,cat:'ass',founded:2008,vols:760,rating:4.6,verified:true,site:'manosalnorte.cl (fictício)',tagline:'Educação e moradia em comunidades rurais do Chile.',desc:'Levamos voluntários a comunidades rurais do norte chileno para apoio escolar, construção de espaços comunitários e projetos de água.'},
  {id:'bright',name:'Bright Futures Collective',ini:'BF',c:'#2C5282',country:'US',state:'NY',city:'Nova York',lat:40.71,lng:-74.01,cat:'edu',founded:2007,vols:5210,rating:4.8,verified:true,site:'brightfutures.org (fictício)',tagline:'Leitura e mentoria para crianças em todo o mundo.',desc:'Programa de leitura acompanhada e mentoria que conecta voluntários de vários países a crianças de 6 a 12 anos por videochamada segura e supervisionada.'},
  {id:'northern',name:'Northern Paws Rescue',ini:'NP',c:'#744210',country:'CA',state:'BC',city:'Vancouver',lat:49.28,lng:-123.12,cat:'ani',founded:2012,vols:640,rating:4.7,verified:true,site:'northernpaws.ca (fictício)',tagline:'Lares temporários e reabilitação animal.',desc:'Rede de lares temporários e clínica comunitária para cães e gatos resgatados na Colúmbia Britânica.'},
  {id:'laco',name:'Associação Laço Atlântico',ini:'LA',c:'#2A4365',country:'PT',state:'',city:'Lisboa',lat:38.72,lng:-9.14,cat:'dh',founded:2016,vols:830,rating:4.8,verified:true,site:'lacoatlantico.pt (fictício)',tagline:'Acolhimento e integração de migrantes e refugiados.',desc:'Apoiamos migrantes e refugiados lusófonos com orientação jurídica, aulas de língua, tradução e integração ao mercado de trabalho.'},
  {id:'solidarite',name:'Solidarité Quartiers',ini:'SQ',c:'#DD6B20',country:'FR',state:'',city:'Paris',lat:48.86,lng:2.35,cat:'ali',founded:2006,vols:1940,rating:4.7,verified:true,site:'solidaritequartiers.fr (fictício)',tagline:'Mercearias solidárias nos bairros de Paris.',desc:'Mantemos mercearias solidárias com preços simbólicos e programas de alimentação para estudantes e famílias de baixa renda.'},
  {id:'grune',name:'Grüne Brücke e.V.',ini:'GB',c:'#276749',country:'DE',state:'',city:'Berlim',lat:52.52,lng:13.40,cat:'amb',founded:2011,vols:1080,rating:4.8,verified:true,site:'gruenebruecke.de (fictício)',tagline:'Hortas urbanas que conectam vizinhos.',desc:'Transformamos terrenos ociosos de Berlim em hortas comunitárias, com oficinas de compostagem e encontros interculturais.'},
  {id:'kizuna',name:'Kizuna Bridge',ini:'KB',c:'#C53030',country:'JP',state:'',city:'Sendai',lat:38.27,lng:140.87,cat:'emg',founded:2011,vols:2310,rating:4.9,verified:true,site:'kizunabridge.jp (fictício)',tagline:'Reconstrução comunitária e preparação para desastres.',desc:'Fundada após o terremoto de 2011, apoia comunidades costeiras de Tohoku com reconstrução, preparação para desastres e programas intergeracionais.'},
  {id:'ubuntu',name:'Ubuntu Health Hands',ini:'UH',c:'#9C4221',country:'ZA',state:'',city:'Cidade do Cabo',lat:-33.92,lng:18.42,cat:'sau',founded:2013,vols:690,rating:4.7,verified:true,site:'ubuntuhealth.org.za (fictício)',tagline:'Clínicas móveis e saúde comunitária.',desc:'Operamos clínicas móveis em assentamentos informais da Cidade do Cabo, com foco em prevenção, saúde materna e educação em saúde.'},
  {id:'saathi',name:'Digital Saathi Foundation',ini:'DS',c:'#0B7285',country:'IN',state:'',city:'Bengaluru',lat:12.97,lng:77.59,cat:'tec',founded:2017,vols:1570,rating:4.8,verified:true,site:'digitalsaathi.in (fictício)',tagline:'Alfabetização digital para mulheres e jovens.',desc:'Capacitamos mulheres de áreas rurais e periféricas da Índia em habilidades digitais, finanças pessoais e empreendedorismo.'},
  {id:'reef',name:'Reef Guardians Australia',ini:'RG',c:'#0987A0',country:'AU',state:'QLD',city:'Cairns',lat:-16.92,lng:145.77,cat:'amb',founded:2010,vols:950,rating:4.9,verified:true,site:'reefguardians.org.au (fictício)',tagline:'Ciência cidadã pela Grande Barreira de Corais.',desc:'Voluntários participam de monitoramento de recifes, limpeza de praias e restauração de corais em parceria com pesquisadores.'},
  {id:'vozes',name:'Vozes da Periferia',ini:'VP',c:'#2D3748',country:'BR',state:'SP',city:'São Paulo',lat:-23.60,lng:-46.75,cat:'dh',founded:2017,vols:470,rating:4.7,verified:false,site:'vozesdaperiferia.org (fictício)',tagline:'Cidadania, direitos e protagonismo jovem.',desc:'Coletivo que promove oficinas de direitos, comunicação comunitária e formação política para jovens das periferias paulistanas.'},
  {id:'atelie',name:'Ateliê Esperança',ini:'AE',c:'#B83280',country:'BR',state:'SC',city:'Florianópolis',lat:-27.59,lng:-48.55,cat:'cul',founded:2015,vols:310,rating:4.8,verified:true,site:'atelieesperanca.org (fictício)',tagline:'Arte como cuidado para crianças e famílias.',desc:'Oferecemos arte-terapia, oficinas criativas e atividades culturais para crianças em acolhimento institucional e suas famílias.'},
  {id:'maosdadas',name:'Instituto Mãos Dadas',ini:'ID',c:'#553C9A',country:'BR',state:'DF',city:'Brasília',lat:-15.79,lng:-47.88,cat:'ass',founded:2010,vols:1120,rating:4.6,verified:true,site:'maosdadas.org (fictício)',tagline:'Assistência social e desenvolvimento comunitário no DF.',desc:'Distribuímos cestas básicas, oferecemos cursos profissionalizantes e acompanhamos famílias em vulnerabilidade nas regiões administrativas do DF.'}
];

/* Oportunidades: id, ong, título, categoria, modalidade, duração, dias, turno, idade mínima, exige experiência,
   remuneração, início imediato, vagas, preenchidas, horas/semana, habilidades, descrição, atividades, requisitos, benefícios, publicada em */
const _O = (id,ong,title,cat,mode,dur,days,shift,age,exp,pay,imm,vagas,filled,hrs,skills,desc,acts,reqs,bens,posted)=>({
  id,ong,title,cat,mode,dur,days:days==='flex'?['flex']:days.split(','),shift,age,exp:!!exp,pay,imm:!!imm,vagas,filled,hrs,
  skills:skills.split(','),desc,acts:acts.split('|'),reqs:reqs.split('|'),bens:bens?bens.split('|'):[],posted
});
const OPPS = [
  _O('mutirao-mata','raizes','Mutirão de reflorestamento da Mata Atlântica','amb','Presencial','curta','sab','manha',16,0,null,1,40,28,4,'Trabalho em equipe,Fotografia','Plante mudas nativas em áreas degradadas às margens do Rio Cachoeira e ajude a recuperar corredores ecológicos urbanos.','Plantio de mudas nativas|Preparo de covas e adubação orgânica|Registro fotográfico do avanço da área','Disposição para trabalho ao ar livre|Menores de 18 anos somente com autorização do responsável','Kit com camiseta, boné e luvas|Lanche e água|Certificado de horas','2026-10-20'),
  _O('educ-amb-escolas','raizes','Educador(a) ambiental em escolas públicas','amb','Híbrido','media','ter,qui','tarde',18,0,{t:'ajuda',v:250},0,8,5,6,'Comunicação,Didática,Design','Conduza oficinas sobre biodiversidade e resíduos com turmas do ensino fundamental e ajude a produzir materiais didáticos.','Oficinas práticas em sala de aula|Criação de materiais visuais|Acompanhamento das hortas escolares','Boa comunicação com crianças|Disponibilidade semanal fixa','Ajuda de custo para transporte|Formação inicial de 8 horas|Certificado','2026-10-02'),
  _O('monitor-rio','raizes','Monitoramento da qualidade da água','amb','Presencial','longa','sab,dom','manha',18,1,null,0,6,2,5,'Ciências,Dados,Biologia','Colete amostras e registre indicadores de qualidade da água em pontos do Rio Cachoeira para um painel público de dados.','Coleta de amostras em campo|Testes com kits colorimétricos|Registro em planilha e aplicativo','Experiência prévia em ciências ou dados|Saber nadar','Treinamento técnico|Equipamentos fornecidos|Carta de recomendação','2026-10-24'),
  _O('reforco-saber','saber','Reforço escolar de matemática','edu','Presencial','media','seg,qua','tarde',18,0,null,1,20,13,4,'Matemática,Didática','Apoie estudantes do 6º ao 9º ano a recuperar conteúdos de matemática em pequenos grupos.','Aulas em grupos de até 5 alunos|Correção de exercícios|Acompanhamento de evolução','Ensino médio completo|Paciência e escuta','Formação pedagógica|Certificado','2026-09-28'),
  _O('mentoria-online','saber','Mentoria de carreira para jovens','edu','Remoto','media','qua','noite',21,1,null,0,30,22,2,'Mentoria,Comunicação,Design,UX','Acompanhe um jovem de 16 a 19 anos em encontros quinzenais online sobre carreira, faculdade e primeiro emprego.','Encontros de 1 hora por videochamada|Revisão de currículo|Simulação de entrevistas','Formação superior ou 3 anos de experiência profissional|Termo de conduta assinado','Formação em mentoria|Certificado','2026-10-05'),
  _O('passeio-patas','patas','Passeios e socialização de cães resgatados','ani','Presencial','curta','sab,dom','manha',16,0,null,1,25,17,3,'Cuidado animal','Ajude cães resgatados a ganhar confiança com passeios, brincadeiras e treino básico de socialização.','Passeios supervisionados|Banho e escovação|Socialização com novos visitantes','Gostar de animais|Menores somente com responsável','Camiseta|Certificado','2026-10-18'),
  _O('foto-adocao','patas','Fotografia para campanhas de adoção','ani','Híbrido','curta','sab','tarde',18,1,null,0,4,1,3,'Fotografia,Design,Redes sociais','Produza retratos e pequenos vídeos dos animais disponíveis para adoção, aumentando suas chances de encontrar um lar.','Sessões de fotos no abrigo|Edição de imagens|Criação de posts para redes','Portfólio de fotografia|Equipamento próprio','Crédito nas publicações|Certificado','2026-10-21'),
  _O('cozinha-solidaria','mesa','Cozinha solidária: preparo de marmitas','ali','Presencial','longa','seg,qua,sex','manha',16,0,null,1,30,19,6,'Culinária,Trabalho em equipe','Prepare refeições nutritivas a partir de alimentos resgatados para mais de 600 famílias por semana.','Pré-preparo de alimentos|Montagem de marmitas|Organização da cozinha','Uso de touca e avental|Curso rápido de boas práticas (oferecido)','Café da manhã|Certificado','2026-10-10'),
  _O('logistica-doacoes','mesa','Logística de doações de alimentos','ali','Presencial','media','ter,qui','tarde',18,0,{t:'ajuda',v:300},0,10,6,6,'Logística,Gestão de projetos,Dirigir','Organize rotas de coleta em feiras e supermercados e controle o estoque de alimentos resgatados.','Planejamento de rotas|Controle de estoque|Contato com doadores','CNH B é um diferencial|Organização','Ajuda de custo|Certificado','2026-10-14'),
  _O('guardioes-rio-negro','amazonia','Guardiões do Rio Negro: expedição de monitoramento','amb','Presencial','curta','flex','flex',21,1,{t:'bolsa',v:1200},0,12,9,40,'Biologia,Dados,Fotografia','Participe de uma expedição de 15 dias com comunidades ribeirinhas para monitorar fauna, flora e qualidade da água.','Coleta de dados em campo|Oficinas com comunidades|Produção de relatório fotográfico','Experiência em pesquisa de campo|Atestado de saúde e vacinas em dia','Hospedagem e alimentação|Bolsa de apoio|Seguro viagem','2026-09-30'),
  _O('conteudo-amazonia','amazonia','Produção de conteúdo sobre a floresta','amb','Remoto','media','flex','flex',18,0,null,1,8,3,3,'Redação,Design,Redes sociais','Transforme relatórios de campo em conteúdos acessíveis para redes sociais e newsletter.','Redação de posts e roteiros|Design de carrosséis|Curadoria de fotos','Boa escrita|Portfólio (desejável)','Certificado|Mentoria em comunicação de impacto','2026-10-22'),
  _O('tarde-aurora','aurora','Tardes de conversa e memória com idosos','ass','Presencial','longa','qua,sex','tarde',16,0,null,1,15,8,3,'Escuta ativa,Comunicação','Visite pessoas idosas para conversas, leitura e atividades de memória que combatem o isolamento.','Rodas de conversa|Leitura compartilhada|Jogos de memória','Empatia e pontualidade|Menores com autorização','Formação sobre envelhecimento|Certificado','2026-10-08'),
  _O('inclusao-digital-60','aurora','Inclusão digital para pessoas 60+','tec','Presencial','media','ter','manha',18,0,null,0,10,4,3,'Tecnologia,Didática','Ensine pessoas idosas a usar celular, aplicativos de banco, videochamadas e a se proteger de golpes.','Aulas práticas individuais|Criação de guias ilustrados|Plantão de dúvidas','Paciência e didática','Certificado','2026-10-12'),
  _O('dev-ongs','codigo','Desenvolvimento de sites para ONGs','tec','Remoto','media','flex','noite',18,1,null,0,16,11,5,'Programação,UX,Design','Integre um squad voluntário que desenvolve sites e sistemas para pequenas organizações sociais.','Desenvolvimento front-end e back-end|Design de interfaces|Reuniões quinzenais com ONGs','Experiência com desenvolvimento web ou design de produto','Mentoria técnica|Portfólio real|Certificado','2026-10-15'),
  _O('aulas-programacao','codigo','Aulas de programação para adolescentes','tec','Híbrido','media','sab','manha',18,1,null,0,8,5,3,'Programação,Didática','Ensine lógica de programação e criação de jogos para adolescentes de escolas públicas.','Aulas aos sábados|Acompanhamento de projetos|Organização de mostra final','Conhecimento em programação|Termo de conduta com menores','Certificado','2026-10-03'),
  _O('oficina-percussao','mar','Oficinas de percussão e cultura afro-brasileira','cul','Presencial','media','sab','tarde',18,1,null,0,6,4,3,'Música,Didática','Conduza ou apoie oficinas de percussão para jovens de 12 a 18 anos no bairro do Rio Vermelho.','Oficinas semanais|Preparação de apresentações|Cuidado com instrumentos','Experiência musical|Termo de conduta com menores','Certificado|Participação no festival','2026-09-25'),
  _O('producao-festival','mar','Produção do Festival Maré Cultural','cul','Presencial','curta','sex,sab,dom','noite',18,0,{t:'ajuda',v:400},1,40,26,12,'Produção de eventos,Comunicação,Fotografia','Faça parte da equipe que produz um festival gratuito com 30 atrações e público de 15 mil pessoas.','Credenciamento e recepção|Apoio de palco|Cobertura de redes sociais','Disponibilidade nos três dias do festival','Ajuda de custo|Camiseta e alimentação|Certificado','2026-10-26'),
  _O('agentes-saude','saudeRede','Agentes comunitários de prevenção','sau','Presencial','media','seg,qua','manha',18,0,null,0,20,12,4,'Saúde,Comunicação','Visite famílias para orientações sobre vacinação, hipertensão e diabetes, em parceria com postos de saúde.','Visitas domiciliares em dupla|Aferição de pressão (após treinamento)|Registro de visitas','Formação inicial de 12 horas','Formação em saúde comunitária|Certificado','2026-10-06'),
  _O('telessaude-acolhe','saudeRede','Acolhimento por teleatendimento (escuta ativa)','sau','Remoto','longa','ter,qui','noite',21,1,null,0,25,18,4,'Psicologia,Escuta ativa','Ofereça escuta acolhedora por chat e telefone, com supervisão de psicólogos da equipe.','Plantões semanais de 2 horas|Supervisão em grupo|Encaminhamentos para a rede de saúde','Formação ou estudo em psicologia, serviço social ou áreas afins','Supervisão clínica|Certificado','2026-09-29'),
  _O('abrigo-emergencia','abrigoSul','Apoio em abrigos emergenciais','emg','Presencial','curta','flex','flex',18,0,null,1,60,41,12,'Logística,Primeiros socorros,Trabalho em equipe','Apoie abrigos temporários na organização de doações, alimentação e acolhimento de famílias desabrigadas.','Triagem de doações|Servir refeições|Atividades com crianças (supervisionadas)','Vacinas em dia|Disponibilidade de 3 dias seguidos','Alimentação|Seguro de acidentes|Certificado','2026-10-27'),
  _O('costa-limpia','patagonia','Limpeza de praias e costas','amb','Presencial','curta','sab','manha',16,0,null,1,80,52,4,'Trabalho em equipe,Espanhol','Recolha e catalogue resíduos nas margens do Río de la Plata para alimentar um estudo sobre poluição plástica.','Coleta de resíduos|Classificação por tipo|Registro em aplicativo','Menores com autorização|Protetor solar','Kit de coleta|Certificado','2026-10-16'),
  _O('apoyo-escolar-cl','manos','Apoio escolar em comunidades rurais','ass','Presencial','media','seg,ter,qua,qui,sex','tarde',18,0,{t:'bolsa',v:900},0,10,7,20,'Espanhol,Didática','Viva 3 meses em uma comunidade do Atacama apoiando crianças nas tarefas escolares e em atividades recreativas.','Reforço escolar|Oficinas recreativas|Apoio a projetos comunitários','Espanhol intermediário|Seguro viagem','Hospedagem com família local|Bolsa de apoio|Certificado','2026-09-20'),
  _O('reading-buddies','bright','Reading Buddies: leitura com crianças','edu','Remoto','media','ter,qui','tarde',18,0,null,1,50,31,2,'Inglês,Didática,Comunicação','Leia com uma criança por videochamada supervisionada e ajude a desenvolver o gosto pela leitura.','Sessões de 30 minutos|Escolha de livros|Registro de progresso','Inglês intermediário|Verificação de antecedentes da organização','Formação online|Certificado internacional','2026-10-11'),
  _O('foster-ca','northern','Lar temporário para filhotes','ani','Presencial','media','flex','flex',21,0,null,0,15,9,10,'Cuidado animal','Receba filhotes em casa por 2 a 8 semanas até a adoção definitiva, com apoio veterinário completo.','Cuidados diários|Socialização|Levar às consultas veterinárias','Residir em Vancouver|Espaço adequado em casa','Ração e cuidados veterinários pagos|Suporte 24h','2026-10-09'),
  _O('apoio-migrantes','laco','Acolhimento de migrantes e refugiados','dh','Híbrido','longa','seg,qua','tarde',18,0,null,0,18,10,4,'Idiomas,Direito,Escuta ativa','Acompanhe famílias recém-chegadas em processos de documentação, matrícula escolar e busca de emprego.','Atendimento de acolhimento|Acompanhamento em serviços públicos|Aulas de português','Ensino superior em curso ou concluído|Sigilo e ética','Formação em direitos dos migrantes|Certificado','2026-10-01'),
  _O('traducao-remota','laco','Tradução voluntária de materiais','dh','Remoto','curta','flex','flex',16,0,null,1,12,5,2,'Inglês,Espanhol,Francês,Redação','Traduza guias de orientação para migrantes para inglês, espanhol, francês e crioulo haitiano.','Tradução de guias|Revisão de textos|Glossário de termos','Fluência em pelo menos um idioma','Certificado|Crédito nos materiais','2026-10-19'),
  _O('epicerie-solidaire','solidarite','Mercearia solidária de bairro','ali','Presencial','media','sab','manha',16,0,null,0,20,14,4,'Francês,Atendimento','Atenda famílias e estudantes na mercearia solidária, organize prateleiras e acolha novos beneficiários.','Atendimento ao público|Reposição de estoque|Acolhimento','Francês básico','Certificado','2026-10-04'),
  _O('urban-garden-berlin','grune','Hortas urbanas comunitárias','amb','Presencial','media','sab','tarde',16,0,null,1,30,18,3,'Jardinagem,Trabalho em equipe','Cultive hortas em terrenos ociosos de Neukölln e participe de oficinas de compostagem com vizinhos.','Plantio e manejo|Compostagem|Organização de mutirões','Inglês ou alemão básico','Colheita compartilhada|Certificado','2026-10-13'),
  _O('kizuna-recovery','kizuna','Reconstrução comunitária pós-desastre','emg','Presencial','curta','flex','manha',18,0,{t:'bolsa',v:1500},0,20,12,30,'Construção,Logística,Inglês','Apoie a recuperação de espaços comunitários em cidades costeiras de Tohoku durante 3 semanas.','Pequenos reparos|Atividades com idosos|Preparação para desastres','Boa condição física|Inglês básico','Hospedagem|Bolsa de apoio|Seguro','2026-10-07'),
  _O('clinic-support-za','ubuntu','Apoio a clínicas móveis','sau','Presencial','media','seg,ter,qua,qui,sex','manha',21,1,{t:'bolsa',v:1100},0,8,6,30,'Enfermagem,Saúde,Inglês','Integre a equipe das clínicas móveis em atividades de triagem, educação em saúde e registro de atendimentos.','Triagem básica|Educação em saúde|Organização de atendimentos','Formação em saúde|Inglês intermediário','Hospedagem|Bolsa de apoio|Supervisão profissional','2026-09-27'),
  _O('digital-literacy-in','saathi','Alfabetização digital para mulheres','tec','Remoto','media','sab','manha',18,0,null,1,40,22,2,'Inglês,Tecnologia,Didática','Conduza aulas online de habilidades digitais e finanças pessoais para mulheres empreendedoras.','Aulas ao vivo|Plantões de dúvidas|Criação de tutoriais','Inglês intermediário','Certificado internacional','2026-10-17'),
  _O('reef-survey','reef','Monitoramento de recifes de coral','amb','Presencial','curta','flex','manha',18,1,null,0,10,8,25,'Mergulho,Biologia,Dados','Participe de mergulhos de monitoramento de corais com pesquisadores por 10 dias.','Mergulhos de levantamento|Registro de dados|Limpeza de praias','Certificação de mergulho|Inglês intermediário','Hospedagem|Equipamentos|Certificado','2026-10-02'),
  _O('vozes-oficina','vozes','Oficinas de direitos e cidadania','dh','Presencial','media','sab','tarde',18,0,null,0,10,6,3,'Direito,Comunicação,Didática','Facilite oficinas sobre direitos, cidadania e comunicação comunitária para jovens.','Planejamento de oficinas|Facilitação de rodas de conversa|Produção de podcast','Experiência com educação popular (desejável)','Formação|Certificado','2026-10-09'),
  _O('atelie-arte','atelie','Arte-terapia para crianças','cul','Presencial','media','qua','tarde',18,1,null,0,6,3,3,'Arte,Desenho,Psicologia','Apoie oficinas de arte-terapia com crianças em acolhimento, sob orientação de arte-terapeutas.','Preparação de materiais|Apoio nas oficinas|Organização de exposição','Experiência com arte ou educação|Termo de conduta com menores','Supervisão especializada|Certificado','2026-10-15'),
  _O('maos-dadas-cestas','maosdadas','Montagem de cestas básicas','ass','Presencial','curta','sab','manha',14,0,null,1,50,33,4,'Trabalho em equipe,Logística','Monte e distribua cestas básicas para famílias acompanhadas pelo instituto.','Separação de alimentos|Montagem de cestas|Apoio na distribuição','Menores de 18 somente com autorização e acompanhamento','Lanche|Certificado','2026-10-23')
];

const EVENTS = [
  {id:'e1',ong:'raizes',title:'Plantio de 1.000 árvores no Parque da Cidade',type:'Plantio de árvores',date:'2026-11-07',time:'08:00',mode:'Presencial',city:'Joinville',country:'BR',spots:120,going:87,desc:'Grande mutirão de plantio com mudas nativas, oficinas para crianças e café comunitário.'},
  {id:'e2',ong:'mesa',title:'Distribuição de alimentos: Natal sem fome',type:'Distribuição de alimentos',date:'2026-12-19',time:'09:00',mode:'Presencial',city:'Recife',country:'BR',spots:200,going:142,desc:'Montagem e entrega de 2 mil kits de Natal para famílias acompanhadas.'},
  {id:'e3',ong:'patas',title:'Feira de adoção responsável',type:'Proteção animal',date:'2026-11-14',time:'10:00',mode:'Presencial',city:'Rio de Janeiro',country:'BR',spots:40,going:31,desc:'Mais de 60 cães e gatos esperando um lar. Voluntários ajudam na recepção e orientação.'},
  {id:'e4',ong:'saber',title:'Formação: como ensinar com empatia',type:'Encontro de formação',date:'2026-11-11',time:'19:00',mode:'Virtual',city:'Online',country:'BR',spots:500,going:318,desc:'Encontro online com especialistas em educação sobre acolhimento e aprendizagem.'},
  {id:'e5',ong:'patagonia',title:'Mutirão de limpeza Costanera Sur',type:'Mutirão de limpeza',date:'2026-11-21',time:'09:00',mode:'Presencial',city:'Buenos Aires',country:'AR',spots:300,going:204,desc:'Limpeza da reserva ecológica Costanera Sur com coleta de dados sobre resíduos.'},
  {id:'e6',ong:'grune',title:'Workshop de compostagem urbana',type:'Oficina educativa',date:'2026-11-28',time:'14:00',mode:'Presencial',city:'Berlim',country:'DE',spots:35,going:22,desc:'Aprenda técnicas de compostagem doméstica e comunitária.'},
  {id:'e7',ong:'codigo',title:'Hackathon Social 48h',type:'Encontro de formação',date:'2026-11-20',time:'18:00',mode:'Híbrido',city:'Curitiba',country:'BR',spots:150,going:118,desc:'48 horas criando soluções digitais para 10 ONGs parceiras.'},
  {id:'e8',ong:'raizes',title:'Oficina de educação ambiental para professores',type:'Oficina educativa',date:'2026-11-18',time:'19:30',mode:'Virtual',city:'Online',country:'BR',spots:200,going:96,desc:'Metodologias práticas para trabalhar biodiversidade em sala de aula.'},
  {id:'e9',ong:'mar',title:'Roda cultural pró-instrumentos',type:'Campanha de arrecadação',date:'2026-12-05',time:'17:00',mode:'Presencial',city:'Salvador',country:'BR',spots:400,going:263,desc:'Apresentações dos alunos e arrecadação para novos instrumentos de percussão.'},
  {id:'e10',ong:'ubuntu',title:'Mutirão de saúde comunitária',type:'Encontro de formação',date:'2026-12-12',time:'08:00',mode:'Presencial',city:'Cidade do Cabo',country:'ZA',spots:60,going:41,desc:'Dia de atendimentos preventivos e educação em saúde em Khayelitsha.'},
  {id:'e11',ong:'kizuna',title:'Formação em resposta a desastres',type:'Encontro de formação',date:'2026-11-25',time:'20:00',mode:'Virtual',city:'Online',country:'JP',spots:1000,going:612,desc:'Curso introdutório (em inglês, com legendas) sobre atuação voluntária em emergências.'},
  {id:'e12',ong:'atelie',title:'Oficina de arte com materiais reciclados',type:'Oficina educativa',date:'2026-11-29',time:'15:00',mode:'Presencial',city:'Florianópolis',country:'BR',spots:30,going:19,desc:'Oficina aberta para famílias com reaproveitamento criativo de materiais.'},
  {id:'e13',ong:'northern',title:'Ação de vacinação e microchipagem',type:'Proteção animal',date:'2026-12-06',time:'10:00',mode:'Presencial',city:'Vancouver',country:'CA',spots:25,going:14,desc:'Dia de vacinação gratuita para animais de famílias de baixa renda.'},
  {id:'e14',ong:'raizes',title:'Limpeza das margens do Rio Cachoeira',type:'Mutirão de limpeza',date:'2026-12-12',time:'08:30',mode:'Presencial',city:'Joinville',country:'BR',spots:80,going:44,desc:'Retirada de resíduos e plantio de mudas ciliares.'},
  {id:'e15',ong:'abrigoSul',title:'Treinamento de voluntários para enchentes',type:'Encontro de formação',date:'2026-11-09',time:'19:00',mode:'Virtual',city:'Online',country:'BR',spots:800,going:530,desc:'Como atuar com segurança em abrigos e centros de distribuição.'}
];

const CAMPS = [
  {id:'c1',ong:'raizes',title:'10 mil mudas para Joinville',cat:'amb',goal:60000,raised:41250,backers:512,deadline:'2026-12-15',desc:'Vamos produzir e plantar 10 mil mudas nativas da Mata Atlântica em parques e margens de rios de Joinville ao longo de 2027. Cada R$ 6 garante uma muda cuidada por dois anos.',uses:['Produção de mudas no viveiro comunitário','Insumos e ferramentas para mutirões','Monitoramento das áreas plantadas']},
  {id:'c2',ong:'mesa',title:'Natal sem fome no Recife',cat:'ali',goal:80000,raised:63400,backers:1204,deadline:'2026-12-20',desc:'Meta de 2 mil kits de Natal com alimentos frescos e uma ceia completa para famílias acompanhadas pela Mesa Cheia.',uses:['Compra de alimentos complementares','Embalagens e transporte','Ceia comunitária']},
  {id:'c3',ong:'patas',title:'Castramóvel para o Rio',cat:'ani',goal:120000,raised:58300,backers:690,deadline:'2027-01-31',desc:'Um veículo adaptado para levar castração gratuita a comunidades da zona norte, prevenindo o abandono de milhares de animais.',uses:['Adaptação do veículo','Equipamentos cirúrgicos','Seis meses de mutirões']},
  {id:'c4',ong:'abrigoSul',title:'Reconstruir lares no Sul',cat:'emg',goal:250000,raised:249100,backers:3120,deadline:'2026-11-30',desc:'Reforma de 40 casas de famílias atingidas pelas enchentes, com materiais e mão de obra voluntária especializada.',uses:['Materiais de construção','Eletrodomésticos básicos','Acompanhamento das famílias']},
  {id:'c5',ong:'codigo',title:'Laboratório de computadores comunitário',cat:'tec',goal:45000,raised:18900,backers:233,deadline:'2027-02-28',desc:'Montagem de um laboratório com 20 computadores para aulas de programação gratuitas.',uses:['20 computadores recondicionados','Internet por 12 meses','Mobiliário']},
  {id:'c6',ong:'mar',title:'Instrumentos para a Maré',cat:'cul',goal:30000,raised:22750,backers:341,deadline:'2026-12-10',desc:'Novos tambores, timbaus e atabaques para as oficinas de percussão de 120 jovens.',uses:['Instrumentos de percussão','Manutenção','Figurinos para apresentações']},
  {id:'c7',ong:'ubuntu',title:'Clínica móvel para Khayelitsha',cat:'sau',goal:90000,raised:47200,backers:402,deadline:'2027-01-15',desc:'Equipar uma nova clínica móvel para ampliar atendimentos preventivos (valores convertidos em R$ para fins demonstrativos).',uses:['Equipamentos médicos','Combustível','Materiais educativos']},
  {id:'c8',ong:'saber',title:'Biblioteca viva nas escolas',cat:'edu',goal:25000,raised:9800,backers:156,deadline:'2027-03-01',desc:'Montagem de 10 cantinhos de leitura em escolas públicas com acervo diverso e mediação voluntária.',uses:['Livros','Estantes e almofadas','Formação de mediadores']}
];

const VOLS = [
  {id:'lucas',name:'Lucas Ferreira',age:24,city:'Joinville',state:'SC',country:'BR',lat:-26.30,lng:-48.85,skills:['Biologia','Fotografia','Trabalho em equipe','Dados'],interests:['amb','ani'],hours:142,pts:3980,avail:'Fins de semana',projects:7,bio:'Biólogo recém-formado, apaixonado por restauração ecológica e fotografia de natureza.'},
  {id:'ana',name:'Ana Beatriz Costa',age:31,city:'Florianópolis',state:'SC',country:'BR',lat:-27.59,lng:-48.55,skills:['Didática','Comunicação','Educação'],interests:['edu','cri','amb'],hours:210,pts:5120,avail:'Terças e quintas à tarde',projects:9,bio:'Professora de ciências e voluntária em educação ambiental há 6 anos.'},
  {id:'rafael',name:'Rafael Souza',age:19,city:'Curitiba',state:'PR',country:'BR',lat:-25.43,lng:-49.27,skills:['Programação','Design','UX'],interests:['tec','amb'],hours:48,pts:1420,avail:'Noites',projects:3,bio:'Estudante de Ciência da Computação, quer usar tecnologia para causas sociais.'},
  {id:'camila',name:'Camila Ito',age:28,city:'São Paulo',state:'SP',country:'BR',lat:-23.55,lng:-46.63,skills:['Psicologia','Escuta ativa','Comunicação'],interests:['sau','dh','inc'],hours:320,pts:6740,avail:'Noites de semana',projects:11,bio:'Psicóloga clínica, voluntária em acolhimento emocional e direitos humanos.'},
  {id:'joao',name:'João Pedro Lima',age:35,city:'Joinville',state:'SC',country:'BR',lat:-26.30,lng:-48.85,skills:['Logística','Gestão de projetos','Dirigir'],interests:['fome','com','amb'],hours:95,pts:2310,avail:'Sábados',projects:5,bio:'Gestor de operações. Ajuda ONGs a organizar logística e mutirões.'},
  {id:'sofia',name:'Sofía Gutiérrez',age:26,city:'Buenos Aires',state:'',country:'AR',lat:-34.60,lng:-58.38,skills:['Espanhol','Inglês','Redação'],interests:['amb','hum'],hours:176,pts:4100,avail:'Flexível',projects:8,bio:'Jornalista ambiental, coordena equipes de limpeza costeira.'},
  {id:'mateus',name:'Mateus Rocha',age:22,city:'Joinville',state:'SC',country:'BR',lat:-26.30,lng:-48.85,skills:['Fotografia','Edição de vídeo','Redes sociais'],interests:['amb','cul'],hours:64,pts:1680,avail:'Fins de semana',projects:4,bio:'Videomaker, documenta projetos sociais e ambientais da região.'},
  {id:'helena',name:'Helena Martins',age:41,city:'Lisboa',state:'',country:'PT',lat:38.72,lng:-9.14,skills:['Direito','Tradução','Escuta ativa'],interests:['dh','inc'],hours:260,pts:5400,avail:'Segundas e quartas',projects:10,bio:'Advogada especializada em migração, voluntária em acolhimento de refugiados.'},
  {id:'yuki',name:'Yuki Tanaka',age:30,city:'Sendai',state:'',country:'JP',lat:38.27,lng:140.87,skills:['Logística','Primeiros socorros','Inglês'],interests:['hum','com'],hours:410,pts:7900,avail:'Flexível',projects:14,bio:'Coordenador de resposta a desastres e formador de voluntários.'},
  {id:'bruna',name:'Bruna Alves',age:16,city:'Joinville',state:'SC',country:'BR',lat:-26.30,lng:-48.85,skills:['Arte','Desenho'],interests:['cul','ani'],hours:12,pts:420,avail:'Sábados',projects:1,bio:'',minor:true},
  {id:'pedro',name:'Pedro Henrique Dias',age:27,city:'Joinville',state:'SC',country:'BR',lat:-26.30,lng:-48.85,skills:['Ciências','Dados','Biologia'],interests:['amb','tec'],hours:120,pts:2950,avail:'Domingos',projects:6,bio:'Engenheiro ambiental, trabalha com qualidade da água e ciência cidadã.'},
  {id:'thandi',name:'Thandi Mokoena',age:29,city:'Cidade do Cabo',state:'',country:'ZA',lat:-33.92,lng:18.42,skills:['Enfermagem','Primeiros socorros','Inglês'],interests:['sau','hum'],hours:380,pts:7200,avail:'Dias úteis',projects:12,bio:'Enfermeira comunitária e voluntária em clínicas móveis.'}
];

const DEMO_VOL = {
  id:'livia',name:'Lívia Moraes',age:27,city:'Joinville',state:'SC',country:'BR',lat:-26.30,lng:-48.85,photo:null,
  email:'livia.demo@12help.app',
  headline:'Designer de UX · Voluntária em projetos ambientais e educacionais',
  bio:'Sou designer de experiência do usuário e acredito que boas ideias precisam de mãos para sair do papel. Desde 2023 participo de mutirões ambientais, mentorias para jovens e campanhas de comunicação para ONGs. Busco projetos onde eu possa unir design, educação e meio ambiente.',
  interests:['amb','edu','ani','tec'],
  skills:['Design','UX','Comunicação','Fotografia','Inglês','Facilitação'],
  avail:{days:['qua','sab','dom'],shift:'noite',mode:'Híbrido',hours:4},
  exp:[
    {id:'x1',ong:'raizes',role:'Voluntária de plantio e comunicação',cat:'amb',start:'2023-03',end:'2024-02',hours:32,country:'BR',city:'Joinville',desc:'Participei de 9 mutirões de plantio e criei a identidade visual da campanha "Joinville mais verde".',skills:['Comunicação visual','Plantio']},
    {id:'x2',ong:'saber',role:'Mentora de design para jovens',cat:'edu',start:'2024-03',end:'2025-06',hours:24,country:'BR',city:'São Paulo',desc:'Mentorei 4 jovens em encontros online sobre carreira em design e portfólio.',skills:['Mentoria','Facilitação']},
    {id:'x3',ong:'patagonia',role:'Mutirão de limpeza costeira',cat:'amb',start:'2024-07',end:'2024-07',hours:12,country:'AR',city:'Buenos Aires',desc:'Coleta e catalogação de resíduos na Costanera Sur durante intercâmbio.',skills:['Ciência cidadã','Espanhol']},
    {id:'x4',ong:'laco',role:'Designer voluntária: campanha de acolhimento',cat:'dh',start:'2025-04',end:'2025-08',hours:18,country:'PT',city:'Lisboa',desc:'Redesenhei o guia de boas-vindas para migrantes, hoje distribuído em 4 idiomas.',skills:['Design editorial','Linguagem simples']}
  ],
  courses:[
    {n:'Primeiros socorros básicos',org:'Cruz Solidária (fictícia)',y:2024,cert:true},
    {n:'Educação ambiental na prática',org:'Instituto Raízes Verdes',y:2023,cert:true},
    {n:'Design para impacto social',org:'Central de Conhecimento 12Help!',y:2025,cert:true}
  ],
  recs:[
    {ong:'raizes',by:'Carla Nunes · Coordenadora de voluntariado',text:'A Lívia transformou nossa comunicação. Comprometida, criativa e sempre presente nos mutirões, mesmo nos dias de chuva.'},
    {ong:'laco',by:'Inês Carvalho · Diretora de projetos',text:'O guia que a Lívia redesenhou tornou o acolhimento muito mais humano. Recomendo sem hesitar.'}
  ]
};

const DEMO_APPS = [
  {id:'a1',opp:'educ-amb-escolas',status:'aceita',date:'2026-10-12'},
  {id:'a2',opp:'foto-adocao',status:'pendente',date:'2026-10-25'},
  {id:'a3',opp:'monitor-rio',status:'pendente',date:'2026-10-27'},
  {id:'a4',opp:'reading-buddies',status:'recusada',date:'2026-09-14',note:'Vagas preenchidas para este ciclo.'}
];

const ONG_APPS = [
  {id:'oa1',vol:'lucas',opp:'monitor-rio',status:'pendente',date:'2026-10-28'},
  {id:'oa2',vol:'ana',opp:'educ-amb-escolas',status:'aceita',date:'2026-10-10'},
  {id:'oa3',vol:'mateus',opp:'mutirao-mata',status:'pendente',date:'2026-10-27'},
  {id:'oa4',vol:'pedro',opp:'monitor-rio',status:'pendente',date:'2026-10-26'},
  {id:'oa5',vol:'joao',opp:'mutirao-mata',status:'aceita',date:'2026-10-18'},
  {id:'oa6',vol:'rafael',opp:'educ-amb-escolas',status:'recusada',date:'2026-10-05'},
  {id:'oa7',vol:'bruna',opp:'mutirao-mata',status:'pendente',date:'2026-10-28'}
];

const DEMO_THREADS = [
  {id:'t1',role:'v',peer:{type:'ong',id:'raizes'},unread:0,msgs:[
    {me:false,text:'Oi, Lívia! Vimos seu perfil e adoraríamos ter você nas oficinas de educação ambiental nas escolas.',t:'2026-10-11T10:12'},
    {me:true,text:'Que ótimo! Tenho disponibilidade às terças e quintas à tarde. Posso ajudar também com materiais visuais.',t:'2026-10-11T10:40'},
    {sys:true,text:'Inscrição em "Educador(a) ambiental em escolas públicas" aceita',t:'2026-10-12T09:00'},
    {me:false,text:'Perfeito! Sua inscrição foi aceita. A formação inicial acontece no dia 05/11, às 14h. Te esperamos!',t:'2026-10-12T09:02'}
  ]},
  {id:'t2',role:'v',peer:{type:'ong',id:'patas'},unread:0,msgs:[
    {sys:true,text:'Confirmação: inscrição em "Fotografia para campanhas de adoção" recebida',t:'2026-10-25T16:20'},
    {me:false,text:'Olá, Lívia! Recebemos sua inscrição. Pode nos enviar o link do seu portfólio?',t:'2026-10-25T17:05'}
  ]},
  {id:'t3',role:'v',peer:{type:'ong',id:'codigo'},unread:1,msgs:[
    {me:false,text:'Olá! Temos um projeto de site para uma ONG de proteção animal e seu perfil de UX combina muito (93%). Topa conversar?',t:'2026-10-29T08:15'}
  ]},
  {id:'t4',role:'o',peer:{type:'vol',id:'lucas'},unread:1,msgs:[
    {me:false,text:'Olá! Me inscrevi no monitoramento da água. Tenho experiência com coleta de amostras na faculdade.',t:'2026-10-28T19:02'}
  ]},
  {id:'t5',role:'o',peer:{type:'vol',id:'ana'},unread:0,msgs:[
    {me:true,text:'Ana, bem-vinda! A formação inicial será no dia 05/11, às 14h.',t:'2026-10-10T11:00'},
    {me:false,text:'Combinado! Posso levar alguns materiais que uso com minhas turmas.',t:'2026-10-10T11:24'}
  ]},
  {id:'t6',role:'o',peer:{type:'vol',id:'livia'},unread:0,msgs:[
    {me:true,text:'Oi, Lívia! Vimos seu perfil e adoraríamos ter você nas oficinas de educação ambiental nas escolas.',t:'2026-10-11T10:12'},
    {me:false,text:'Que ótimo! Tenho disponibilidade às terças e quintas à tarde. Posso ajudar também com materiais visuais.',t:'2026-10-11T10:40'}
  ]}
];

const DEMO_NOTIFS = [
  {id:'n1',role:'v',type:'match',text:'Nova oportunidade compatível: <b>Produção de conteúdo sobre a floresta</b>',link:'#/oportunidade/conteudo-amazonia',t:'2026-10-29T09:10',read:false},
  {id:'n2',role:'v',type:'msg',text:'<b>Código do Bem</b> enviou uma nova mensagem',link:'#/mensagens',t:'2026-10-29T08:15',read:false},
  {id:'n3',role:'v',type:'interest',text:'<b>Instituto Raízes Verdes</b> demonstrou interesse no seu perfil',link:'#/ong/raizes',t:'2026-10-27T14:30',read:false},
  {id:'n4',role:'v',type:'accept',text:'Sua inscrição em <b>Educador(a) ambiental em escolas públicas</b> foi aceita',link:'#/v/inscricoes',t:'2026-10-12T09:00',read:true},
  {id:'n5',role:'v',type:'badge',text:'Você conquistou a medalha <b>Conexão Global</b>',link:'#/v/conquistas',t:'2025-08-30T18:00',read:true},
  {id:'n6',role:'v',type:'goal',text:'A campanha <b>Reconstruir lares no Sul</b> está a menos de 1% da meta',link:'#/vaquinha/c4',t:'2026-10-28T12:00',read:true},
  {id:'n7',role:'o',type:'app',text:'<b>Lucas Ferreira</b> se inscreveu em Monitoramento da qualidade da água',link:'#/o/inscricoes',t:'2026-10-28T19:00',read:false},
  {id:'n8',role:'o',type:'app',text:'<b>Bruna Alves</b> (menor de idade) se inscreveu no Mutirão de reflorestamento',link:'#/o/inscricoes',t:'2026-10-28T10:00',read:false},
  {id:'n9',role:'o',type:'msg',text:'<b>Lucas Ferreira</b> enviou uma mensagem',link:'#/mensagens',t:'2026-10-28T19:02',read:false},
  {id:'n10',role:'o',type:'goal',text:'A campanha <b>10 mil mudas para Joinville</b> passou de 65% da meta',link:'#/o/campanhas',t:'2026-10-25T09:00',read:true}
];

const DEMO_ACTIVITY = [
  {t:'2026-10-27',text:'Inscreveu-se em Monitoramento da qualidade da água',i:'check'},
  {t:'2026-10-25',text:'Inscreveu-se em Fotografia para campanhas de adoção',i:'check'},
  {t:'2026-10-20',text:'Confirmou presença no evento Plantio de 1.000 árvores',i:'cal'},
  {t:'2026-10-12',text:'Inscrição aceita em Educador(a) ambiental em escolas públicas',i:'award'},
  {t:'2026-09-12',text:'Doou R$ 50 para 10 mil mudas para Joinville',i:'coins'},
  {t:'2025-08-30',text:'Conquistou a medalha Conexão Global',i:'globe'},
  {t:'2025-08-30',text:'Concluiu Designer voluntária na Associação Laço Atlântico (18h)',i:'flag'}
];

const ARTICLES = [
  {id:'primeiro-voluntariado',cat:'Primeiros passos',min:6,title:'Seu primeiro voluntariado: como escolher a causa certa',excerpt:'Um roteiro prático para alinhar propósito, tempo disponível e habilidades antes de se inscrever.',body:['Escolher a primeira experiência de voluntariado costuma ser mais difícil do que parece. Há tantas causas urgentes que é comum sentir que qualquer escolha deixa algo de fora. O ponto de partida é outro: qual causa mantém você motivado mesmo quando a novidade passa?','Faça três perguntas antes de se inscrever. Quanto tempo realista eu tenho por semana? Que habilidades posso oferecer agora? Prefiro atividades presenciais, remotas ou um formato híbrido? As respostas formam o seu perfil de compatibilidade na 12Help! e melhoram as recomendações.','Comece com algo curto, como um mutirão ou um evento de um dia. Experiências curtas ajudam a conhecer a organização e a sua própria rotina como voluntário antes de assumir um compromisso de meses.']},
  {id:'seguranca-presencial',cat:'Segurança',min:4,title:'Encontros presenciais com segurança',excerpt:'Boas práticas antes, durante e depois de atividades presenciais com organizações que você ainda não conhece.',body:['Antes de qualquer atividade presencial, confira o perfil da organização, as avaliações de outros voluntários e o endereço completo da ação. Prefira primeiros encontros em locais públicos ou na sede da ONG.','Avise alguém de confiança sobre onde você estará e por quanto tempo. Nunca compartilhe documentos pessoais por mensagem antes de confirmar a legitimidade da organização pelos canais oficiais.','Se algo parecer estranho, interrompa a atividade e use o botão Denunciar no perfil. A equipe de confiança da plataforma analisa todos os relatos.']},
  {id:'curriculo-social',cat:'Carreira',min:5,title:'Como o voluntariado fortalece seu currículo',excerpt:'Recrutadores valorizam experiências sociais. Saiba registrar horas, habilidades e resultados.',body:['Experiências voluntárias demonstram iniciativa, trabalho em equipe e capacidade de lidar com contextos diversos. O segredo é registrá-las como qualquer experiência profissional: com função, período, horas dedicadas e resultados concretos.','No Currículo Voluntário da 12Help! cada experiência pode receber recomendações das organizações, o que dá credibilidade ao seu histórico.','Destaque habilidades adquiridas, como facilitação, logística ou comunicação, e conecte-as aos seus objetivos de carreira.']},
  {id:'ongs-voluntarios',cat:'Para ONGs',min:7,title:'Como engajar e reter voluntários',excerpt:'Do acolhimento à celebração: práticas para transformar inscritos em parceiros de longo prazo.',body:['A primeira semana define a relação. Uma mensagem de boas-vindas, uma formação inicial clara e um ponto de contato definido reduzem drasticamente a desistência.','Reconheça contribuições com frequência: certificados, registros de horas, recomendações e momentos de celebração mostram que o tempo doado faz diferença.','Use os indicadores do painel da ONG para identificar projetos com baixa taxa de preenchimento e ajustar descrição, horários ou requisitos.']},
  {id:'voluntariado-internacional',cat:'Global',min:8,title:'Voluntariado internacional: o que considerar',excerpt:'Vistos, seguros, custos e ética: um guia para quem quer atuar em outro país.',body:['Voluntariar em outro país pode ser transformador, mas exige planejamento. Verifique as regras de visto, contrate seguro viagem e entenda quais custos são cobertos pela organização.','Desconfie de programas que cobram valores altos sem transparência ou que oferecem contato com crianças sem processos de proteção. Organizações sérias priorizam o benefício da comunidade, não a experiência do visitante.','Prefira projetos de média e longa duração, nos quais o conhecimento local é respeitado e você atua em parceria com profissionais da região.']},
  {id:'menores-voluntariado',cat:'Segurança',min:5,title:'Voluntariado para adolescentes: regras e cuidados',excerpt:'Como a 12Help! protege voluntários menores de idade e o que pais e responsáveis devem saber.',body:['Adolescentes a partir de 14 anos podem participar de atividades compatíveis com sua idade, sempre com autorização de um responsável legal e em ações supervisionadas.','Perfis de menores de idade têm visibilidade restrita: não aparecem em buscas públicas e as organizações só podem iniciar contato com a aprovação do responsável.','Nenhuma atividade com menores pode envolver deslocamentos sem acompanhamento, pernoite ou funções de risco.']}
];

const STORIES = [
  {id:'s1',ong:'raizes',cat:'amb',title:'O rio que voltou a ter sombra',place:'Joinville, Brasil',stat:'86 mil mudas',text:'Em 2018, as margens do Rio Cachoeira eram um corredor de concreto e lixo. Seis anos e 214 mutirões depois, a mata ciliar voltou, as garças reapareceram e as escolas do bairro adotaram trechos do rio como sala de aula. A maior parte das mudas foi plantada por voluntários que chegaram pela 12Help!.'},
  {id:'s2',ong:'abrigoSul',cat:'emg',title:'40 casas, 40 recomeços',place:'Porto Alegre, Brasil',stat:'2.870 voluntários',text:'Quando a água baixou, o desafio era recomeçar. Eletricistas, pedreiros e estudantes de arquitetura se organizaram em equipes pela plataforma para reformar casas de famílias que perderam tudo. Dona Sueli, 71 anos, recebeu as chaves da casa reformada no dia do seu aniversário.'},
  {id:'s3',ong:'saathi',cat:'tec',title:'Primeira loja online aos 42 anos',place:'Bengaluru, Índia',stat:'12 mil mulheres formadas',text:'Priya vendia bordados apenas na feira do bairro. Depois de 8 semanas de aulas com voluntárias de quatro países, abriu sua loja online e hoje emprega três vizinhas. A turma dela continua se encontrando todo sábado.'},
  {id:'s4',ong:'patas',cat:'ani',title:'Thor encontrou uma família',place:'Rio de Janeiro, Brasil',stat:'1.300 adoções',text:'Thor passou três anos no abrigo. As fotos feitas por uma voluntária fotógrafa mostraram o cão brincalhão que ele era e, em uma semana, 11 famílias pediram para conhecê-lo. Hoje ele vive em Niterói com duas crianças e um gato.'}
];

const TESTIMONIALS = [
  {name:'Mariana Okafor',role:'Voluntária em Lisboa e Recife',text:'Encontrei na 12Help! um projeto que unia minha formação em nutrição com o combate à fome. Em seis meses, já colaborei com ONGs em dois países.',cat:'ali'},
  {name:'Carla Nunes',role:'Coordenadora · Instituto Raízes Verdes',text:'Antes, a gente perdia semanas divulgando mutirões. Hoje publicamos uma oportunidade e, em dois dias, temos voluntários compatíveis inscritos.',cat:'amb'},
  {name:'Kenji Watanabe',role:'Voluntário em resposta a desastres',text:'O sistema de match entendeu exatamente minha experiência com logística. O passaporte virou meu portfólio de impacto.',cat:'emg'}
];

const TEAM = [
  {name:'Beatriz Lemos',role:'Cofundadora & CEO',bio:'Ex-coordenadora de programas humanitários em 3 continentes.'},
  {name:'Daniel Okoye',role:'Cofundador & CTO',bio:'Engenheiro de produto, construiu plataformas para 10 milhões de usuários.'},
  {name:'Marina Sato',role:'Head de Confiança e Segurança',bio:'Especialista em proteção de dados e salvaguarda de crianças.'},
  {name:'Rafael Antunes',role:'Head de Parcerias com ONGs',bio:'15 anos de experiência no terceiro setor brasileiro.'}
];

const REVIEWS = [
  ['Organização impecável e equipe muito acolhedora. Voltarei com certeza.',5],
  ['A formação inicial fez toda a diferença. Me senti preparado desde o primeiro dia.',5],
  ['Projeto lindo e com impacto visível. Só senti falta de mais horários à noite.',4],
  ['Coordenação atenciosa e comunicação clara pela plataforma.',5],
  ['Experiência transformadora, aprendi muito com a comunidade.',5],
  ['Boa estrutura, mas o local é um pouco difícil de chegar de transporte público.',4]
];
