---
title: AWS Lambda 初探
publish: true
---

## 总览
笔者尽量通过终端的方式, 最终我们将拥有
1. 一个Lambda
2. 一个API Gateway
3. 两个向资源的IAM Role

## In Action

### Lambda-1
笔者此时此刻毫无准备, 那么常规的做法是通过help命令看看我们都能对lambda做些啥?
```shell script
aws lambda help
```
```text
NAME
       lambda -

DESCRIPTION
          Overview
       This  is  the AWS Lambda API Reference . The AWS Lambda Developer Guide
       provides additional information. For the service overview, see What  is
       AWS  Lambda  , and for information about how the service works, see AWS
       Lambda: How it Works in the AWS Lambda Developer Guide .
```
很幸运, aws对cli的help有很完尽的表述. 那我们就开始尝试创建自己的第一个lambda吧~!

1. create Lambda
我也不大熟悉这个cmd, 那么先get help一下呗
```shell script
aws lambda create-function help
```
第二句话, 就能看到...To create a function, you need a deployment package and an execution role .
很棒, 笔者什么准备工作都没有做好, 通过这里的描述告诉我们, 首先需要一段lambda可执行的代码, 另外我们需要创建一个授权调用对应资源的role. 
受挫感很强烈, 但是blog要继续, C'est la vie.

### Role-1
还是通过
```shell script
aws iam help
aws iam create-role help
```
看到了好多英文, 好多概念好像都是不认识的@.@. 幸亏, 拉到下面, 我看到了一个example. 
```text
EXAMPLES
       To create an IAM role
       The following create-role command creates a role  named  Test-Role  and
       attaches a trust policy to it:

          aws iam create-role --role-name Test-Role --assume-role-policy-document file://Test-Role-Trust-Policy.json

       Output:
          {
            "Role": {
                "AssumeRolePolicyDocument": "<URL-encoded-JSON>",
                "RoleId": "AKIAIOSFODNN7EXAMPLE",
                "CreateDate": "2013-06-07T20:43:32.821Z",
                "RoleName": "Test-Role",
                "Path": "/",
                "Arn": "arn:aws:iam::123456789012:role/Test-Role"
            }
          }

``` 
试着打一下吧, 反正创建IAM不收费~
```shell script
aws iam create-role --role-name lambda-2020-role --assume-role-policy-document my2020policy.json --profile leweihe
```

咦, 这里我们需要一个policy json 文件~ 
```json
//my2020policy.json
{
  //这个version 也不要乱改哦...
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```
细看之下, 原来是........在aws文档里笔者遇到了, 笔者遇到过的最绕的中文.
> trust-policy.json 文件是当前目录中的 JSON 文件，该文件定义了角色的信任策略。此信任策略通过向服务委托人授予调用 AWS Security Token Service AssumeRole 操作所需的 lambda.amazonaws.com 权限来允许 Lambda 使用角色的权限。

有谁看懂了请联系我~ lewei.me@gmail.com.
管他三七二十一 加上执行.

我勒个去, 这样简单的脚本都抛出错误...
```text
An error occurred (MalformedPolicyDocument) when calling the CreateRole operation: This policy contains invalid Json
```
面向stackflow编程之后发现, file:// 是不能轻易省去的, 即使你是MAC OS 还是linux 还是Windows, 
于是加上file:// 执行成功!
```shell script
aws iam create-role --role-name lambda-2020-role --assume-role-policy-document file://my2020policy.json --profile leweihe
---
{
    "Role": {
        "Path": "/",
        "RoleName": "lambda-2020-role",
        "RoleId": "AROAVQFNXQJN6FXPHIZEU",
        "Arn": "arn:aws-cn:iam::378321470043:role/lambda-2020-role",
        "CreateDate": "2020-07-27T12:21:24+00:00",
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "lambda.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }
    }
}
```

棒棒哒, 有了role, 我们就拥有了trigger lambda 的权利. 下一步, 我们需要一个打包好的lambda代码, 来实现一个简单的小功能.

###Lambda Coding
记得上周的时候, AWS培训师告诉我们, coding这个事情大概就是ctrl c + ctrl v. 笔者觉得他说的很有道理. 自己会的事情为什么还要费脑子思考呢. 直接github ctrl c 吧.
git@github.com:awsdocs/aws-lambda-developer-guide.git
这是aws给的范例和文档, 果断clone.

copy 了整个example 里的java-basic 项目. 我们就拥有了本地编译环境, 能够愉快的在本地编译lambda, 当然记得以前有很多vim高手, 可以在没有编译环境下编程的牛人, 也可以盲打. 
大概无论是盲打, 还是通过java-basic 的环境来开发, 我们都需要了解两个request 入参
1. Map<String, String> event
一个可以自定的键对值, 这是通过调用lambda时候的json入参.
2. Context context
包含了各自环境变量, lambda 配置, 运行时参数, client参数.
OK 简单的实现一个小小咪咪的程序, 传入的是字体和字母, 返回一个字符串banana, 像这样的
```text
███████╗██╗   ██╗ ██████╗██╗  ██╗    ██╗   ██╗
██╔════╝██║   ██║██╔════╝██║ ██╔╝    ██║   ██║
█████╗  ██║   ██║██║     █████╔╝     ██║   ██║
██╔══╝  ██║   ██║██║     ██╔═██╗     ██║   ██║
██║     ╚██████╔╝╚██████╗██║  ██╗    ╚██████╔╝
╚═╝      ╚═════╝  ╚═════╝╚═╝  ╚═╝     ╚═════╝ 
```
ok 祭出源代码
```gradle
build.gradle
implementation 'io.leego:banana:1.3.1'
```
```java
// Handler value: com.leweii.banana.lambda.Handler
public class Handler implements RequestHandler<Map<String, String>, String> {
    Gson gson = new GsonBuilder().setPrettyPrinting().create();

    @Override
    public String handleRequest(Map<String, String> event, Context context) {
        LambdaLogger logger = context.getLogger();
        String response = BananaUtils.bananaify(event.get("text"), event.getOrDefault("font", "ANSI_Shadow"));
        // log execution details
        logger.log("ENVIRONMENT VARIABLES: " + gson.toJson(System.getenv()));
        logger.log("CONTEXT: " + gson.toJson(context));
        // process event
        logger.log("EVENT: " + gson.toJson(event));
        logger.log("EVENT TYPE: " + event.getClass().toString());
        logger.log("Response: \n" + response);
        return response;
    }
}
```
接下来gradle build zip 然后上传咯
```shell script
./gradlew buildZip
```
哎呀呀呀晕, 现在才想起来, 我们还没有创建lambda.

### Lambda-2
再次打出, 寻求出路.
```shell script
aws lambda create-function help
```
看到如下一些比较重要的参数.
1. --function-name: a name
2. --zip-file: 指定刚刚的源代码咯
3. --handler: 介个就是放main class的package咯~ 
4. --runtime: 支持好多语言, 我们用的是java 8/11
5. --role: 这个就是我们绕来绕去绕不开的坑了呗. 就是刚创建的role arn.
> 关于这个arn 多说几句, 基本上就是这样的格式
> region: aws服务器region
> account: 378321470043, 对应account的唯一标识符. 标明这个role, user, group, xxx 都是属于378321470043 account的. 
> role-name: role name
> arn:{region}:iam::{account}:role/{role-name}

于是我们有了如下的命令
```shell script
aws lambda create-function --function-name lambda-2020 \
##--这个fileb:// 同理 也不要乱改哦~
--zip-file fileb://banana-lambda.zip --handler com.leweii.banana.lambda.Handler --runtime java11 \
--role arn:aws-cn:iam::378321470043:role/lambda-2020-role --profile leweihe
```

卧槽, 一次成功, 有一种写了二十行代码, 一次运行成功的感觉 -.-
output能看到所有需要的信息, 如果有错可以用 aws lambda update-function-xxx 来改咯, 不再赘述.
```json
{
    "FunctionName": "lambda-2020",
    "FunctionArn": "arn:aws-cn:lambda:cn-northwest-1:378321470043:function:lambda-2020",
    "Runtime": "java11",
    "Role": "arn:aws-cn:iam::378321470043:role/lambda-2020-role",
    "Handler": "com.leweii.banana.lambda.Handler",
    "CodeSize": 781899,
    "Description": "",
    "Timeout": 3,
    "MemorySize": 128,
    "LastModified": "2020-07-27T13:03:28.351+0000",
    "CodeSha256": "TOXzu+Q8963WI5niekViN154pGI8J2O3fAR/TOMKXSM=",
    "Version": "$LATEST",
    "TracingConfig": {
        "Mode": "PassThrough"
    },
    "RevisionId": "309ede4a-3beb-40a7-a9be-4e618fbdadc5",
    "State": "Active",
    "LastUpdateStatus": "Successful"
}
```

既然成功了, 单靠这个output似乎有点不够充分必要, 总有什么命令是可以trigger 我的lambda function吧?
help一下~
```shell script
aws lambda help
```
英文不大好的我找了 trigger, execute, 无果. 不过好像看到了一类似的 invoke, 打开词典一查, 有援引~换起~用法术召唤的意思....
看到用法术召唤, 我就知道了, 我要invoke my beast. 照理, help 一下.

```shell script
aws lambda invoke help
```
copy example来填鸭吧
```shell script
aws lambda invoke \
              --cli-binary-format raw-in-base64-out \
              --function-name lambda-2020 \
              --payload '{ "name": "Bob", "text": "Bob" }' \
              --profile leweihe \
              response.json
```

卧槽, 又一次成功, 又是这样的感觉....

打开response.json 看看呗
```shell script
cat response.json
```

### API Gateway

1. create Lambda

2. 



接下来的内容有点让人费解, 笔者第一次配置是通过AWS Lambda UI的鼠标点击来操作的. 但是后来理解了前面那句非常非常绕的话之后. 好像有点知道自己在干啥了.....
这句话有点经典, 我愿意再po一次.
> trust-policy.json 文件是当前目录中的 JSON 文件，该文件定义了角色的信任策略。此信任策略通过向服务委托人授予调用 AWS Security Token Service AssumeRole 操作所需的 lambda.amazonaws.com 权限来允许 Lambda 使用角色的权限。
