import Koa from 'koa';
import * as fs from 'fs.promised';
import path from 'path';
import * as Router from 'koa-router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser'

const config = {
    port: 12301,
    template: '/public/index.html',
    publicUrl: '/public/'
};
const app = new Koa();
const router = new Router();
const index = fs.readFileSync(path.join(process.cwd(), config.template), 'utf8');

let writed = false;
const writeFile = async () => {
    let dir = path.join(process.cwd(), config.publicUrl)
    if (!writed) {
        writed = !!1;
        let exists = await fs.exists(dir);
        if (!exists){
            fs.mkdir(dir);
        }
        await fs.writeFile(path.join(dir, 'index.html'), index);
    }
    await fs.readFile(path.join(dir, 'index.html'), 'utf8');
}
writeFile();

app.use(bodyParser({}));
app.use(serve(
    path.join(process.cwd(), config.publicUrl),
    {}
));

router.get('/:name', async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.type = 'html';
    ctx.response.body = await fs.readFile(path.join(process.cwd(), config.publicUrl, name + '.html'), 'utf8');
});

router.get('/', async (ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = await writeFile();
});

app.use(router.routes());

app.listen(config.port);
console.log('');
console.log('http://localhost:' + config.port);
console.log('');
