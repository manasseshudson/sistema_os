const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { Knex } = require('knex');
const knex = require('./database/database');
const base64 = require('base-64');
const path = require('path');
const cors = require('cors');

const router = express.Router();

require('dotenv').config();
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


router.get('/principal/:uid_usuario', async (req,res)=>{ 
     const { uid_usuario } = req.params;
    
    try {

		const formatter = new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		  });

        const usuario = await knex('tb_usuario').where({ uid_usuario }).select().first();

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado');
        }

        const { id_empresa, descricao: nome_user } = usuario;

		const empresa = await knex('tb_empresa').where({ id_empresa }).select().first();

        const ordem_servico = await knex('tb_ordem_servico')
		.leftJoin('tb_situacao_os','tb_situacao_os.id','tb_ordem_servico.situacao')
		.leftJoin('tb_tipo_servico','tb_tipo_servico.id','tb_ordem_servico.tipo_servico')		
		.select('tb_ordem_servico.id','tb_ordem_servico.placa','tb_ordem_servico.cliente',
				'tb_ordem_servico.dataLancamento','tb_ordem_servico.dataPrevisaoSaida',
				'tb_ordem_servico.valor','tb_situacao_os.nome as situacao','tb_tipo_servico.nome as tipo_servico',
				'tb_ordem_servico.numeroOS','tb_ordem_servico.observacao')
		.orderBy('situacao','ASC')		
		;
		

		
		const qtde_ordem_servico_aberta = await knex('tb_ordem_servico').count('id as qtde').where({situacao:1}).select().first();
		const qtde_ordem_servico_analise = await knex('tb_ordem_servico').count('id as qtde').where({situacao:3}).orWhere({situacao:5}).select().first();
       

		console.log(qtde_ordem_servico_aberta)
		
        res.render('home', {
            
            uid_usuario,
            nome_user,
            nome_empresa: "",
            id_empresa,
            ordem_servico,
			qtde_ordem_servico_aberta: qtde_ordem_servico_aberta.qtde,
			qtde_ordem_servico_analise: qtde_ordem_servico_analise.qtde
        });
		
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar dados');
    }
	
})

module.exports = router;