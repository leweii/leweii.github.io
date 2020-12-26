---
publish: true
layout: post
title: "Spring Security integrates with OIDC"
date: 2020-08-01 15:39:50 +0800
author: Jakob He
---


### 1. **废话不多说, 概念自己查**
关键字:
spring security
oidc

### 2. **In Action**

#### 2.1 OIDC Login solution using Spring Security

##### 2.1.1 init a project with spring security 

![spring proj generator]({{ site.url }}/assets/post_images/2020-08-01-spring-security-integrate-w-oidc/pic1.jpg)

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

![project tree]({{ site.url }}/assets/post_images/2020-08-01-spring-security-integrate-w-oidc/pic2.jpg)

##### 2.1.2 配置service 端 app credentials 和 redirect url
也就是你要从哪一个平台拿取info? 这里我们用google 做范例.
先在google console 建一个application 并且生成一个credentials.
redirect url 记得配上

```text
http://localhost:8081/login/oauth2/code/google
```

![google console]({{ site.url }}/assets/post_images/2020-08-01-spring-security-integrate-w-oidc/pic3.jpg)

##### 2.1.3 配置spring security client
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

配置spring-security, spring security 基础配置, 这篇文章不赘述, 更多细节可以参考[这篇]({{ site.url }}/java/blog/2019/04/09/spring-security-in-action.html)
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

#### 2.2 access user info
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

做完了?
卧槽
是的...

##### 2.1.4 我们来测试一下呗
启动application.
浏览器访问
```sh
http://localhost:8081/user/oidc-principal

http://localhost:8081/user/oidc-claims
```
重定向到google login page, 返回时带上所有登录用户的d信息~

做了一个youtube demo.

[![click to redirect]({{ site.url }}/assets/post_images/2020-08-01-spring-security-integrate-w-oidc/pic3.jpg)](https://youtu.be/wXcHgP_DqHQ)


### 3. **小结一下吧**


通篇文章来自[Spring Security and OpenID Connect](https://www.baeldung.com/spring-security-openid-connect)

它在试图说明一个问题, 那就是spring security 对oauth 2.0 的login 支持已经达到了傻瓜保姆级.

但是如果要写一个customerlize  的security 验证服务器, 需要对框架🈶更深入的理解. 

---

[source code](https://github.com/leweii/oidc-demo)

[Spring Security and OpenID Connect](https://www.baeldung.com/spring-security-openid-connect)

对了, 写博客的同时,  我要围住我的土兜兜.
![tudoudou]({{ site.url }}/assets/post_images/2020-08-01-spring-security-integrate-w-oidc/pic4.jpeg)
