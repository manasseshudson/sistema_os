const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { Knex } = require('knex');
const knex = require('./database/database');
const base64 = require('base-64');
const path = require('path');
const cors = require('cors');

require('dotenv').config();
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

const principal = require('./principal');
const clientes = require('./clientes');

app.use('/',principal);
app.use('/',clientes);

app.get('/', (req,res)=>{ 
    res.render('loginv2')

})

app.get('/config/:uid_usuario',async(req,res)=>{
	const {uid_usuario}= req.params;
	
	try {
		const checklist = await knex('tb_checklist').select();
		
        res.render('config', {
            uid_usuario,
			checklist
        });
		
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar dados');
    }
	
})


app.post('/status_add',(req,res)=>{
	const { descricao, uid_usuario  } = req.body;
	
	try{
	
		knex('tb_situacao_os')
		.insert({
				nome: descricao
		}).then(result=>{
			res.redirect('/status/'+uid_usuario)
			
		})
	}
	catch(error){
		console.log(error)
	}
	
})

app.get('/status/:uid_usuario', (req,res)=>{ 
	const { uid_usuario } = req.params;

	knex('tb_situacao_os').select().then(status_os=>{

		res.render('status',{ 
				status_os,
				uid_usuario
				} 
		)
	})
})

app.get('/statusRem/:id/:uid_usuario', (req,res)=>{ 
	const { id, uid_usuario } = req.params;

	try{
		knex('tb_situacao_os').where({id}).delete().then(result=>{
			res.redirect('/status/'+uid_usuario)
			console.log('excluiu')
		})
		
	}catch(error){
		console.log(error)
	}
})



app.get('/tipoServico/:uid_usuario', (req,res)=>{ 
	const { uid_usuario } = req.params;

	knex('tb_tipo_servico').select().then(tipo_servico=>{

		res.render('tipo',{ 
				tipo_servico,
				uid_usuario
				} 
		)
	})
})

app.post('/tipo_servico_add',(req,res)=>{
	const { descricao, uid_usuario  } = req.body;
	
	try{
	
		knex('tb_tipo_servico')
		.insert({
				nome: descricao
		}).then(result=>{
			res.redirect('/tipoServico/'+uid_usuario)
			
		})
	}
	catch(error){
		console.log(error)
	}
	
})




app.get('/tipo_servico/excluir/:id/:uid_usuario',(req,res)=>{
	const { id, uid_usuario } = req.params;
	
	
	try{
		knex('tb_tipo_servico').where({id}).delete().then(result=>{
			res.redirect('/tipoServico/'+uid_usuario)
			console.log('excluiu')
		})
		
	}catch(error){
		console.log(error)
	}
	
	
})











app.get('/dadosOs/:id', (req,res)=>{
	const {id} = req.params;
	
	knex('tb_ordem_servico').where({id}).select().then(result=>{
		console.log(result)
		res.send(result)
		
	});
})


app.post('/addOS', async(req,res)=>{
	const {placa,cliente,dataLancamento,dataPrevisaoSaida,situacao,tipo_servico,valor,observacao, uid_usuario} = req.body;
	
    if(valor==''){
        _valor = 0;
    }else{
        _valor = valor;
    }
    let numeroOS= numeroOrdemServico();
	
	try{
		
		const cliente_nome = await knex('tb_cliente').where({ nome: cliente }).first();
		if (!cliente_nome) {
			const [id] = await knex("tb_cliente").insert({
				  nome: cliente
			});
		}
	}
	catch(error){
		console.log(error)
	}
	
	try{
		const clientes = await knex('tb_cliente').where({ nome: cliente }).first();
		const motos = await knex('tb_motos').where({ placa }).first();

		//console.log(clientes)
		//console.log(motos)
		
		
		if (!motos) {
			knex('tb_motos').insert({
				placa,
				id_cliente: clientes.id_cliente
			}).then(result=>{ 
				console.log(result)
			})				
		}
	}
	catch(error){
		console.log(error)
		
	}
	
	const cliente_ = await knex('tb_cliente').where({ nome: cliente }).first();
	const moto_ = await knex('tb_motos').where({ placa }).first();
	
	
	//console.log('cliente: '+ cliente)
	//console.log('ID_CLIENTE : '+cliente_.id_cliente)
	//console.log(cliente_)
	
	//return;
	try{
		knex('tb_ordem_servico').insert({
			id_cliente: cliente_.id_cliente,
			id_moto: moto_.id,
			placa,
            cliente,
            dataLancamento,
            dataPrevisaoSaida,
            situacao,
            tipo_servico,
            valor:_valor,
            observacao,
            uid_usuario,
            numeroOS
		}).then(result=>{
            console.log(result)
        })
		res.json({mensagem: "Ordem de Serviço Criado com Sucesso"});
	}catch(erro){
		res.json({mensagem: "Erro ao Cadastrar Ordem de Serviço"});
		
	}
	
})

//LISTAGEM DE CLIENTE

//FIM LISTAGEM DE CLIENTE

app.get ('/ordem_servico/:uid_usuario', async (req,res)=>{
	const { uid_usuario } = req.params;
	try{
		 const ordem_servico = await knex('tb_ordem_servico')
		.leftJoin('tb_situacao_os','tb_situacao_os.id','tb_ordem_servico.situacao')
		.leftJoin('tb_tipo_servico','tb_tipo_servico.id','tb_ordem_servico.tipo_servico')		
		.select('tb_ordem_servico.id','tb_ordem_servico.placa','tb_ordem_servico.cliente','tb_ordem_servico.dataLancamento','tb_ordem_servico.dataPrevisaoSaida',
				'tb_ordem_servico.valor',
				'tb_situacao_os.nome as situacao',
				'tb_tipo_servico.nome as tipo_servico','tb_ordem_servico.numeroOS','tb_ordem_servico.observacao');
		
		
		res.render('ordem',{
			ordem_servico,
			uid_usuario
		})
	}catch(error){
		console.log(error)
		
	}
	
})




app.get('/getDados/:placa', async (req,res)=>{
	const { placa } = req.params;
	
	try {
		// busca a moto pela placa
		const moto = await knex("tb_motos").where({ placa }).first();
	
		console.log(moto)
	
		if (!moto) {
			console.log("Moto não encontrada")
			return res.status(404).json({ error: "Moto não encontrada" });
		}

		// supondo que sua tabela motos tenha relação com clientes
		let cliente = await knex("tb_cliente").where({ id_cliente: moto.id_cliente }).first();
		
		if(cliente===undefined){
			cliente="Não Identificado";
		}
	
		res.json({
		  placa: moto.placa,
		  cliente: cliente.nome,
		  modelo: moto.modelo,
		  cor: moto.cor,
		  ano: moto.ano
		});

	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Erro ao buscar dados" });
	}
	
})

app.get('/tipo_servico', async (req,res)=>{
	
	const tipo_servico = await knex('tb_tipo_servico').select();
	
	res.json(tipo_servico);	
})


app.get('/situacao', async (req,res)=>{
	
	const situacao = await knex('tb_situacao_os').select();
	
	res.json(situacao);	
})


app.post('/login', async (req,res)=>{
    const { email, senha} = req.body;
    let _email = base64.encode(email);
    let _senha = base64.encode(senha);


    console.log(_email)
    console.log(_senha)
    try{
		//const user = await knex('tb_usuario').where({usuario: _email, senha: _senha}).select();
		
        knex('tb_usuario').where({usuario: _email, senha: _senha}).select().then(result=>{ 
			console.log(result);
            if(result.length>0){                
                knex('tb_empresa').where({id_empresa: result[0].id_empresa}).select().then(empresa=>{
                    console.log(empresa)
                    res.cookie('user', result[0].uid_usuario); 
					res.send(result[0].uid_usuario)
					
                })
            }else{
				res.send('Usuário ou senha inválidos')
			}            
        })
    }catch(error){
        console.log(error)
    }	
})



function numeroOrdemServico() {
    const agora = new Date();

    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
    const dia = String(agora.getDate()).padStart(2, '0');
    const hora = String(agora.getHours()).padStart(2, '0');
    const min = String(agora.getMinutes()).padStart(2, '0');
    const seg = String(agora.getSeconds()).padStart(2, '0');

    return ano+mes+dia+'-'+hora+min+seg;
}

// Exemplo de uso:
//console.log(getDataHoraAtual());


app.post('/moto_editar',(req,res)=>{
	const { uid_usuario, id_cliente, placa, modelo, marca,  ano} = req.body;
	
	try{
		knex('tb_motos')
		.where({ placa })
		.update({ 
			marca:  marca === '' ? null: marca,
			modelo: modelo ==='' ? null : modelo,
			ano:    ano === '' ? null : ano					
		}).then(result=>{
			console.log('moto atualizada com sucesso')
			res.status(200).json({ mensagem: "Moto Atualizada com Sucesso!" });
			//res.redirect('/clienteEditar/'+uid_usuario+'/'+id_cliente)
		})
		
	}
	catch(error){
		console.log(error)
	}
})


app.post('/moto_add',(req,res)=>{
	const { uid_usuario, id_cliente, placa, modelo, marca,  ano} = req.body;
	
	try{
		knex('tb_motos')
		.insert({ 
			id_cliente,
			placa : placa === '' ? null: placa,
			marca:  marca === '' ? null: marca,
			modelo: modelo ==='' ? null : modelo,
			ano:    ano === '' ? null : ano					
		}).then(result=>{
			console.log('moto atualizada com sucesso')
			res.status(200).json({ mensagem: "Moto Cadastrada com Sucesso!" });
			//res.redirect('/clienteEditar/'+uid_usuario+'/'+id_cliente)
		})
		
	}
	catch(error){
		console.log(error)
	}
})

app.post('/finalizarOrdemServico',(req,res)=>{
	const { idOrdemServico } = req.body;
	
	console.log(idOrdemServico)
	try{
		knex('tb_ordem_servico')
		.where({id: idOrdemServico})
		.update({ 
			situacao: 6
		}).then(result=>{
			console.log('moto atualizada com sucesso')
			res.status(200).json({ mensagem: "Ordem de Serviço Finalizado com Sucesso!" });
			//res.redirect('/clienteEditar/'+uid_usuario+'/'+id_cliente)
		})
		
	}
	catch(error){
		console.log(error)
	}
	
})

app.get("/agenda/:uid_usuario", (req, res) => {
	const { uid_usuario}= req.params;
  res.render("agendamento",{uid_usuario});
});


app.listen( 3011,()=>{
	console.log('Api Rodando porta  3011')
})


app.get('/checlist/:numeroOS/:uid_usuario',async (req,res)=>{
	const {numeroOS, uid_usuario}= req.params;
	
	console.log(numeroOS, uid_usuario)
	
})