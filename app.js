#!/usr/bin/env node --harmony

const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const handlebars = require('handlebars');


program
    .version('zh-cli 1.0.0', '-v, --version')
    .option('-w, --watch', 'watch files change')
    .command('init <name>')
    .action(name => {
        if (!fs.existsSync(name)) {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Give your app a name',
                    default: name
                  },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Give your app a description',
                    default: 'A yunniao project.'
                },
                {
                    type: 'input',
                    name: 'author',
                    message: 'author',
                    default: 'zhanghaov'
                },
                {
                    type: 'input',
                    name: 'license',
                    message: 'license',
                    default: 'ISC'
                },
                {
                    type: 'confirm',
                    name: 'moveon',
                    message: 'Continue?'
                }
            ]).then(answer => {
                // TODO answer 项目描述
                const spinner = ora('正在下载模板...');
                spinner.start();
                download('http://dev.xunhuji.me:17990:scm/beeper/beeper_ydcms', name, {clone: true}, err => {
                    if (err) {
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err))
                    } else {
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name: answer.name,
                            description: answer.description,
                            author: answer.author
                        }
                        if(fs.existsSync(fileName)){
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    }
                })
            })
        } else {
            // 当前目录下改项目已经存在
            console.log(symbols.error, chalk.red('this project already exist.'))
        }

    })
program.parse(process.argv);