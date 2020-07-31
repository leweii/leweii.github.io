 ---
layout: post
publish: true
title:  "Spring Security integrate with OIDC"
date:   2020-07-31 16:31:07 +0800
tags: [JAVA, Spring-Security]
categories: [java, blog]
author: Jakob He
---


## 1. **废话不多说, 概念自己查**
关键字:
spring security
oidc
lti

## 2. **In Action**

### 2.1 OIDC Login solution using Spring Security

#### 2.1.1 init a project with spring security 

![spring proj generator]({{ site.url }}/assets/2020-08-01-spring-security-integrate-w-oidc/pic1.png)

基本上就是加上一些依赖:
1. spring-boot-starter-oauth2-client
2. spring-boot-starter-web
3. lombok
没想到的以后再加.

下面是一个生成这一切的链接:
```text
https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.3.2.RELEASE&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.demo&dependencies=oauth2-client,lombok,web
```
下载proj zip 包, 或者下载build.gradle 自己创建文件树

![project tree]({{ site.url }}/assets/2020-08-01-spring-security-integrate-w-oidc/pic2.png)

#### 2.1.2 配置service 端 app credentials 和 redirect url
也就是你要从哪一个平台拿取info? 这里我们用google 做范例.
先在google console 建一个application 并且生成一个credentials.
redirect url 记得配上

```text
http://localhost:8081/login/oauth2/code/google
```

![google console]({{ site.url }}/assets/2020-08-01-spring-security-integrate-w-oidc/pic3.png)

#### 2.1.3 配置spring security client
```yml
spring:
  security:
    oauth2:
      client:
        registration: 
          google: 
            client-id: <client-id>
            client-secret: <secret>
```

配置spring-security 
```java
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        Set<String> googleScopes = new HashSet<>();
        googleScopes.add("https://www.googleapis.com/auth/userinfo.email");
        googleScopes.add("https://www.googleapis.com/auth/userinfo.profile");

        OidcUserService googleUserService = new OidcUserService();
        googleUserService.setAccessibleScopes(googleScopes);

        http.authorizeRequests(authorizeRequests -> authorizeRequests.anyRequest()
                .authenticated())
                .oauth2Login(oauthLogin -> oauthLogin.userInfoEndpoint()
                        .oidcUserService(googleUserService));
    }// @formatter:on
}
```
做完了?
卧槽
是的...

#### 2.1.4 我们来测试一下呗
启动application.
浏览器反问

### 2.2 access user info
id token 就是那一个, oidc 封装在oauth2.0 之上其中一样冬冬.

那么, 就来创建一个controller 提取这些信息吧~
```java
@GetMapping("/oidc-principal")
public OidcUser getOidcUserPrincipal(
  @AuthenticationPrincipal OidcUser principal) {
    return principal;
}
```

他能这样用

```java
Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
if (authentication.getPrincipal() instanceof OidcUser) {
    OidcUser principal = ((OidcUser) authentication.getPrincipal());
    
    // ...
}
```
