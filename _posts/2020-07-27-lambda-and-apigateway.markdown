---
title: AWS Lambda 初探
publish: true
---

写在前头的后面的话, 全篇有一半的内容都是在试错和debug的内容, 充满了不和谐的粗话和坎坷的心路历程, 可酌情阅读. 整个内容比较冗长.
谈谈整个过程的感受, 用Java 开发lambda 有几个缺点:
1. 需要预编译的环境, 不像python /nodejs 可在线直接开发.
2. java 的第三方包size 不小, 不过lambda 给了10m 的源码容量, 如果是同样写满10m 的源码, 相信python 能做更多事.
3. api gateway 的配置有点不够傻瓜式? 我想如果是一个中国企业做的系统, 应该是充满了拖拽和预配置的.

## 总览
笔者尽量通过终端的方式配置, 最终我们将拥有
1. 一个Lambda
2. 一个API Gateway
3. 两个向资源的IAM Role

开始吧~

## In Action

### 1. Lambda-1

笔者此时此刻也毫无准备, 那么常规的做法是通过help 命令看看我们都能对lambda 做些啥?

```sh
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

很幸运, aws 对cli 的help 有很完尽的表述. 那我们就开始尝试创建自己的第一个lambda 吧~!

#### 1.1 try to create Lambda

我也不大熟悉这个cmd, 那么先get help 一下呗

```sh
aws lambda create-function help
```

第二句话, 就能看到...To create a function, you need a deployment package and an execution role .
很棒, 两个准备工作我们没有一样准备好~ 
通过这里的描述告诉我们, 首先需要一段lambda可执行的代码, 另外我们需要创建一个role , 并且分配可调用lambda 的资源. 
受挫感很强烈, 但是blog 要继续, C'est la vie. 那么我们回头开始准备工作吧, 一个role 和一个可执行的代码包.

### 2. Role-1

还是通过help

```sh
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

#### 2.1 create iam role

试着打一下吧, 反正创建IAM 不收费~

```sh
aws iam create-role --role-name lambda-2020-role --assume-role-policy-document my2020policy.json --profile leweihe
```

咦, 这里我们需要一个policy json 文件~ 看格式像是一个json 格式的定义文件.

my2020policy.json

```json
{
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
不过管他三七二十一 加上执行.

我勒个去, 这样简单的脚本都抛出错误...

```text
An error occurred (MalformedPolicyDocument) when calling the CreateRole operation: This policy contains invalid Json
```

面向stack overflow 编程之后发现, file:// 是不能轻易省去的, 即使你是MAC OS 还是linux 还是Windows, 
于是加上file:// 执行成功!

```sh
aws iam create-role --role-name lambda-2020-role --assume-role-policy-document file://my2020policy.json --profile leweihe
```

output: 

```json
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

### 3. Lambda Coding

#### 3.1 思路
记得上周的时候, AWS培训师告诉我们, coding这个事情大概就是ctrl c + ctrl v. 笔者觉得他说的很有道理. 自己会的事情为什么还要费脑子思考呢. 直接github ctrl c 吧.
git@github.com:awsdocs/aws-lambda-developer-guide.git
这是aws给的范例和文档, 果断clone.

copy 了整个example 里的java-basic 项目. 我们就拥有了本地编译环境, 能够愉快的在本地编译lambda, 当然记得以前有很多vim高手, 可以在没有编译环境下编程的牛人, 也可以盲打. 
大概无论是盲打, 还是通过java-basic 的环境来开发, 我们都需要了解两个request 入参
> i. Map<String, String> event
一个可以自定的键对值, 这是通过调用lambda时候的json入参.
> ii. Context context
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

#### 3.2 ok 祭出源代码

build.gradle

```gradle
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

```sh
./gradlew buildZip
```

哎呀呀呀晕, 现在才想起来, 我们还没有创建lambda.

### 4. Lambda-2

再次打出, 寻求出路.

```sh
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

#### 4.1 创建lambda

于是我们有了如下的命令

```sh
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

#### 4.2 测试lambda
既然成功了, 单靠这个output似乎有点不够充分必要, 总有什么命令是可以trigger 我的lambda function吧?
help一下~

```sh
aws lambda help
```

英文不大好的我找了 trigger, execute, 无果. 不过好像看到了一类似的 invoke, 打开词典一查, 有援引~换起~用法术召唤的意思....
看到用法术召唤, 我就知道了, 我要invoke my beast. 照例, help 一下.

```sh
aws lambda invoke help
```

copy example来填鸭吧

```sh
aws lambda invoke \
              --cli-binary-format raw-in-base64-out \
              --function-name lambda-2020 \
              --payload '{ "name": "Bob", "text": "Bob" }' \
              --profile leweihe \
              response.json
```

卧槽, 又一次成功, 又是这样的感觉....

打开response.json 看看呗

```sh
cat response.json
```

output
```text
"██████╗  ██████╗ ██████╗ \n██╔══██╗██╔═══██╗██╔══██╗\n██████╔╝██║   ██║██████╔╝\n██╔══██╗██║   ██║██╔══██╗\n██████╔╝╚██████╔╝██████╔╝\n╚═════╝  ╚═════╝ ╚═════╝ \n                         "⏎
```

哟嘿, 有了, 但是换行好像有点问题, 没关系lambda works, 剩下的以后代码慢慢调整.
接下来是创建一个api gateway, 好让广大的banana爱好者能够一同便利的生成出自己的banana.

### 5. API Gateway
api gateway 顾名思义, 就是一个门, 有条路~
门能访问控制, 连接aws 各种资源. lambda, ec2, s3 xxx.

gtsqesy, help 

```sh
aws apigateway help
aws apigateway create-rest-api help
```

#### 5.1 create api gateway
想速成, 就直接翻到example吧, 想连英文阅读理解, 就慢慢看下来. 反正我大概找到方法了.

```sh
aws apigateway create-rest-api --name 'banana-2020' --description 'to trigger the lambda to generate a banana.' --profile leweihe
```

哎 终于没有那种一次跑过的感觉了, 遇到了一个error, 我们一起来面向Stack Overflow吧~

```text
Endpoint Configuration type EDGE is not supported in this region: cn-northwest-1
```

看起来是酱紫的, 创建api gateway的时候, 可以选择各种type, edge 看起来像是边缘节点, 但是边缘节点在我的祖国中国是无法创建的, 我和我的祖国一刻也不能分离, 那我换一个type吧~
照例 help 一下, 看看有啥别的选择不, 反正创建api gateway也不收钱.

```text
types -> (list)
              A  list  of  endpoint  types of an API ( RestApi ) or its custom
              domain name ( DomainName ). For an edge-optimized  API  and  its
              custom domain name, the endpoint type is "EDGE" . For a regional
              API and its custom domain name, the endpoint type is REGIONAL  .
              For a private API, the endpoint type is PRIVATE .
```

好了, 这里说的很清楚了, 三个选择EDGE/REGIONAL/PRIVATE
那我就选REGIONAL吧~ 毕竟我和我的祖国一刻也不能分离~

> types: 用于指定对应的endpoint类型
> vpcEndpointIds: 指定多个vpc域

吧? 我看文档的理解是酱紫的, 所以有错的话请读者指出哦....
改一下shell

```sh
aws apigateway create-rest-api --name 'banana-2020' --description 'to trigger the lambda to generate a banana.' --profile leweihe \
--endpoint-configuration='{ "types": ["REGIONAL"] }'
```

再次无语, 记住这个错误, 我们会再次回想到他的.

```text
An error occurred (BadRequestException) when calling the CreateRestApi operation: VPCEndpoints can only be specified with PRIVATE apis.
```

所以~ 我只能做一个private person. 再改一下吧~

```sh
aws apigateway create-rest-api --name 'banana-2020' --description 'to trigger the lambda to generate a banana.' --profile leweihe \
--endpoint-configuration='{ "types": ["PRIVATE"] }'
```

output, 记下id, 待会要用哦.

```json
{
    "id": "r0i94dlswk",
    "name": "banana-2020",
    "description": "to trigger the lambda to generate a banana.",
    "createdDate": "2020-07-27T21:51:31+08:00",
    "apiKeySource": "HEADER",
    "endpointConfiguration": {
        "types": [
            "PRIVATE"
        ]
    }
}
```

#### 5.2 创建api resource

--parent-id 是对应资源的根节点id, 也就是这个资源你想放在哪个门上, 由哪个门来控制.
在创建api(第一步)的时候, aws 默认会创建一个根resource. 所以我们需要先get这个根resource的id哦

```sh
aws apigateway get-resources --rest-api-id r0i94dlswk --profile leweihe
```

output

```json
{
    "items": [
        {
            "id": "ox8o6t69l6",
            "path": "/"
        }
    ]
}
```

--path-part The last path segment for this resource. 简单说就是url path.

```sh
aws apigateway create-resource --rest-api-id r0i94dlswk --path-part banana-2020 \
--parent-id ox8o6t69l6 --profile leweihe
```

output, 记住id 待会要用哦.

```json
{
    "id": "hoo898",
    "parentId": "ox8o6t69l6",
    "pathPart": "banana-2020",
    "path": "/banana-2020"
}
```

#### 5.3 创建POST
我们有了资源, 可以给他指定各种方法/POST/GET/PUT/DELETE....

```sh
aws apigateway put-method --rest-api-id r0i94dlswk --resource-id hoo898 \
--http-method POST --authorization-type NONE --profile leweihe
```

output:

```json
{
    "httpMethod": "POST",
    "authorizationType": "NONE",
    "apiKeyRequired": false
}
```
#### 5.4 关联api 与lambda

接下来这步的cmd让笔者有点费解, 笔者第一次配置是通过AWS Lambda UI的鼠标点击来操作的.
第二次根据文档试了又试, 实在无法通关.
无奈, 只好反向拉出arn 看看自己错在哪里.
对比之!
--uri 'arn:**aws-cn**:apigateway:cn-northwest-1:lambda:path/2015-03-31/functions/arn:**aws-cn**:lambda:cn-northwest-1:378321470043:function:lambda-2020/invocations' \
--uri 'arn:**aws**:apigateway:cn-northwest-1:lambda:path/2015-03-31/functions/arn:**aws**:lambda:cn-northwest-1:378321470043:function:lambda-2020/invocations' \

笔者此时此刻感慨, 中国特色果然十分不同寻常~

得出正确答案只中国特色如下

```sh
aws apigateway put-integration --rest-api-id r0i94dlswk --resource-id hoo898 \
--http-method POST --type AWS --integration-http-method POST \
--uri 'arn:aws-cn:apigateway:cn-northwest-1:lambda:path/2015-03-31/functions/arn:aws-cn:lambda:cn-northwest-1:378321470043:function:lambda-2020/invocations' \
--profile leweihe
```

```json
{
    "type": "AWS",
    "httpMethod": "POST",
    "uri": "arn:aws-cn:apigateway:cn-northwest-1:lambda:path/2015-03-31/functions/arn:aws-cn:lambda:cn-northwest-1:378321470043:function:lambda-2020/invocations",
    "passthroughBehavior": "WHEN_NO_MATCH",
    "timeoutInMillis": 29000,
    "cacheNamespace": "hoo898",
    "cacheKeyParameters": []
}
```

#### 5.5 加入integration response map
```sh
aws apigateway put-integration-response --rest-api-id r0i94dlswk \
    --resource-id hoo898 --http-method POST \
    --status-code 200 --response-templates application/json="" \
    --profile leweihe
```

```text
{
    "statusCode": "200",
    "responseTemplates": {
        "application/json": null
    }
}
```

#### 5.6 配置响应类型json

这步就是定义api validation 和response code, 哎, 感觉就是看help 填鸭, 不懂先看help吧, 再不懂发邮件, support case, 或者找一个aws 销售假装自己是上市公司要迁移阿里云的应用, 他们会很热情的给你解答所有问题.....

```sh
aws apigateway put-method-response --rest-api-id r0i94dlswk \
--resource-id hoo898 --http-method POST \
--status-code 200 --response-models application/json=Empty \
--profile leweihe
```

```json
{
    "statusCode": "200",
    "responseModels": {
        "application/json": "Empty"
    }
}
```

#### 5.7 deploy api gateway

```sh
aws apigateway create-deployment --rest-api-id r0i94dlswk --stage-name prod --profile leweihe
```

尼玛 output是

```text
An error occurred (BadRequestException) when calling the CreateDeployment operation: Private REST API doesn't have a resource policy attached to it
```

卧槽, 居然不能发布private endpoint, 正在懊恼复盘的时候, 笔者留意到上面的一个限制

```text
CreateRestApi operation: VPCEndpoints can only be specified with PRIVATE apis.
```

好吧, 登录到console, 手动修改到Regional呗~ 暂时绕过这个问题, 但是我跟它还没完~!

行吧 重新deploy

```json
{
    "id": "6n6t7e",
    "createdDate": "2020-07-27T23:26:25+08:00"
}
```

#### 5.8 赋予api 调用lambda 的权限

```sh
aws lambda add-permission --function-name lambda-2020 \
--statement-id apigateway-stage-st --action lambda:InvokeFunction \
--principal apigateway.amazonaws.com \
--source-arn "arn:aws:execute-api:cn-northwest-1:378321470043:r0i94dlswk/prod/POST/banana-2020" \
--profile leweihe
```

```json
{
    "Statement": "{\"Sid\":\"apigateway-prod-st\",\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"apigateway.amazonaws.com\"},\"Action\":\"lambda:InvokeFunction\",\"Resource\":\"arn:aws-cn:lambda:cn-northwest-1:378321470043:function:lambda-2020\",\"Condition\":{\"ArnLike\":{\"AWS:SourceArn\":\"arn:aws:execute-api:cn-northwest-1:378321470043:r0i94dlswk/prod/POST/banana-2020\"}}}"
}
```

## Test and use it

自我感觉很良好, 那我们来赶紧试试看.
打开api gateway 的console -> 点击test, 传入我们lambda 需要的输入

```json
{
  "text": "Jakob He",
  "font": "ANSI_Shadow"
}
```

结果让我感到很不爽

```log
Tue Jul 28 00:29:38 UTC 2020 : Sending request to https://lambda.cn-northwest-1.amazonaws.com.cn/2015-03-31/functions/arn:aws-cn:lambda:cn-northwest-1:378321470043:function:lambda-2020/invocations
Tue Jul 28 00:29:38 UTC 2020 : Execution failed due to configuration error: Invalid permissions on Lambda function
Tue Jul 28 00:29:38 UTC 2020 : Method completed with status: 500
```

大概就是api 成功调用了, 但是没有足够的权限调用lambda function?~ 开启debug模式.
看起来是这一步出现了问题.

![Image]({{ site.url }}/assets/2020-07-27-lambda-and-apigateway/pic1.jpg)

经过比较久的排查, 终于找到了原因.
当我们调用API 的时候, 我们需要传入Authorization 信息, api gateway 会一路传递这个Authorization 信息, 但是回顾`5.3 创建POST`步, 我们选择了--authorization-type NONE, 导致Authorization 信息被过滤, 并且无法继续传递到下一个对lambda 调用的步骤.
那我们改一改我们resource 的method 吧, 让它能够支持Authorization

```sh
aws apigateway update-method help
```

```text
 authorizationType -> (string)
          The  method's  authorization  type.  Valid  values are NONE for open
          access, AWS_IAM for using AWS IAM permissions, CUSTOM  for  using  a
          custom  authorizer,  or  COGNITO_USER_POOLS for using a Cognito user
          pool.

       authorizerId -> (string)
          The identifier of an  Authorizer to use on this method.  The  autho-
          rizationType must be CUSTOM .
```

我们看到authorizationType 支持NONE /AWS_IAM / CUSTOM... 我们需要使用AWS_IAM.

```sh
aws apigateway update-method --rest-api-id r0i94dlswk --resource-id hoo898 --http-method POST \
    --patch-operations op="replace",path="/authorizationType",value="AWS_IAM" --profile leweihe
```

发布之后再次测试!

```sh
curl --location --request POST 'https://r0i94dlswk.execute-api.cn-northwest-1.amazonaws.com.cn/prod/banana-2020' \
--header 'X-Amz-Content-Sha256: beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3' \
--header 'X-Amz-Date: 20200728T071817Z' \
--header 'Authorization: AWS4-HMAC-SHA256 Credential=AKIAVQFNXQJN57QG7JI7/20200728/cn-northwest-1/execute-api/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=d0b571c6cb20753e37eb554ad006a6afabaf382f56a341f2d837d0d928bfee38' \
--header 'Content-Type: text/plain' \
--data-raw '{
  "name": "banana generator",
  "text": "FUCK U",
  "font": "ANSI_Shadow"
}'
```

![Image]({{ site.url }}/assets/2020-07-27-lambda-and-apigateway/pic2.jpg)

## 总结

啥都不多说了, 我要赶紧去invalid 自己的IAM key and values 👋🏼