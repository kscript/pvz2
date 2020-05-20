import typescript from "rollup-plugin-typescript"
import replace from 'rollup-plugin-replace'
import babel from "rollup-plugin-babel"

// import { uglify } from 'rollup-plugin-uglify'

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
            "sourceMap": true
        }),
        babel(),
        replace({
            ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
        }),
    ].concat(
        // process.env.NODE_ENV !== 'production' 
        // ? [] 
        // : 
        uglify()
    )
};

export default config;
