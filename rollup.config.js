import typescript from "rollup-plugin-typescript";
import jsx from "rollup-plugin-jsx";
import replace from 'rollup-plugin-replace';
import babel from "rollup-plugin-babel";

const env = process.env.NODE_ENV;
const config = {
    input: 'src/main.jsx',
    output: {
        file: 'bundle.js',
        format: 'cjs'
    },
    plugins: [
        typescript({
            "target": "es5",
            "sourceMap": false
        }),
        jsx({
            arrayChildren: true,
            factory: 'React.createElement.bind(this)',
            spreadFn: 'Object.assign',
            unknownTagPattern: 'React.createComponent.call(this, {tag})'
        }),
        babel(),
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
        }),
    ].concat(
        // process.env.NODE_ENV !== 'production' ? uglify({}, uglifyES) : []
    )
};

export default config;
