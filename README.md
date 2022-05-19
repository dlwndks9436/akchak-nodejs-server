# akchak-nodejs-server

![악착 feature](https://user-images.githubusercontent.com/84265308/169192389-8717f0af-55e7-4749-ac49-584024628466.png)

# akchak

## 어플 체험해보기

https://play.google.com/store/apps/details?id=com.juann.resonar

## API Document 보기

https://akchak.com/api/docs/

---------------------------------------------------------
### 프로젝트 소개
많은 사람들이 악기 연습을 할 때 여러 가지 이유로 어려움을 겪습니다.
악기를 연습해도 실력이 빠르게 늘지 않거나, 혼자 연습하느라 지루하고 동기부여가 될만한 자극이 부족할 때도 있습니다.
이런 문제들을 해소하기 위해 제작한 앱이 '악착'입니다.

'악착'은 시작할 때 목표를 정하도록 합니다.
정할 수 있는 목표의 종류는 음악과 교본이 있습니다.
연습할 목표를 정하고나면 본격적으로 연습을 시작할 수 있습니다.

연습을 시작하면 '악착'이 카메라를 통해서 사용자의 모습을 녹화하게 됩니다.
악기를 연습할 때 자기의 연주를 녹화해서 모니터링하는 것은 정말 중요합니다.
카메라로 녹화된 영상에서는 자신의 연주 자세나 박자나 소리에 어떤 문제가 있는지 알 수 있게 됩니다.
하지만 많은 사람들이 귀찮다는 이유로 하지 않고 있습니다.
'악착'을 통해서 자신의 연주를 녹화해서 내 실력을 점검할 수 있습니다.

연습을 끝내면 '악착'에서는 다른 사용자들과 자신의 연주 영상을 공유할 수 있도록 영상 자르기 기능을 제공합니다.
별도의 툴 없이 영상에서 잘 연주했다고 생각한 부분만 잘라서 영상을 업로드할 수 있습니다.
손쉽게 섬네일 제작할 수 있는 기능도 제공합니다.

영상 업로드를 완료하면 자신의 연습 시간이 업데이트 되며, 프로필 화면에서 주간 평균 연습 시간과 함께 연습 시간을 차트로 확인할 수 있습니다.
다른 사람들의 연주영상을 홈화면에서 조회할 수 있습니다.
다른 사람들의 연습하는 모습을 보면서 자극을 받을 수 있습니다.

#### 기술스택
* typescript
* nodejs
* mysql

#### 서버
* express

#### 클라우드
* aws 

#### CI
* github

#### 주요 패키지
* bcryptjs
* datefns
* express-validator
* http-status-codes
* jsonwebtoken
* nodemailer
* sequelize
* swagger-jsdoc


### ERD

![akchak-erd](https://user-images.githubusercontent.com/84265308/169198900-93710bfa-902f-4a67-ae5c-df4c0dc84ca2.png)

### infrastructure

![악착 인프라](https://user-images.githubusercontent.com/84265308/169219930-d47100df-1e96-4ec9-b5a6-b4bbd9c49991.png)

## 구현한 기능

* Mysql event scheduler를 이용해서 테이블 내 이래 조건에 해당되는 row 삭제
  * 유저가 회원가입한 이후 12 시간 이내에 이메일 인증하지 않을 경우
  <img width="610" alt="화면 캡처 2022-05-19 140659" src="https://user-images.githubusercontent.com/84265308/169212392-30ae6095-1df1-48c3-92c9-ce1e60fd9519.png">
  
  * refresh token이 30일 동안 사용되지 않았을 경우
  <img width="601" alt="화면 캡처 2022-05-19 140659" src="https://user-images.githubusercontent.com/84265308/169212575-f6fe17df-e91e-4ce2-96d1-bcdecf4273d7.png">
  
  * 인증코드 발급된지 5분이 지났을 때
  <img width="707" alt="화면 캡처 2022-05-19 140659" src="https://user-images.githubusercontent.com/84265308/169212773-434f5680-d4e0-4714-ba8e-21802d0cdb17.png">

* 한글 텍스트 입력 및 조회가 가능하도록 sequelize.js와 aws rds 환경에 charset: utf8, collate: utf8_general_cli 적용
* 삭제되는 데이터를 참조하는 다른 데이터들도 자동으로 삭제되도록 cascade 적용
* elastic beanstalk로 배포 환경 구축
<img width="913" alt="화면 캡처 2022-05-19 140659" src="https://user-images.githubusercontent.com/84265308/169214307-3e11e465-0a76-4662-a986-bec0a5c0ed2b.png">

* aws route53 사용하여 akchak.com 도메인 주소를 사용하여 aws elasticbeanstalk 환경에 routing 되도록 함.
<img width="1129" alt="화면 캡처 2022-05-19 140659" src="https://user-images.githubusercontent.com/84265308/169214827-71490f21-81cd-4e36-bdeb-1d736917fa25.png">

* aws acm을 이용해서 akchak.com에 ssl 적용해서 https 통신이 가능하도록 함.
* aws api gateway를 이용해서 aws lambda function 사용
* 동영상, 섬네일 업로드는 aws lambda function에서 presigned url을 통해 처리하여 server 부담을 덜어냄.

* api 문서를 조회할 수 있도록 swagger-jsdoc과 swagger-ui-express 사용
  * https://akchak.com/api/docs
<img width="1277" alt="화면 캡처 2022-05-19 140659" src="https://user-images.githubusercontent.com/84265308/169215185-f0c6089a-194a-4696-8445-22594680d0e9.png">

* 회원가입할 때 유저가 입력한 이메일로 인증코드 보낼 수 있도록 nodemailer 사용
<img width="640" alt="화면 캡처 2022-05-19 140659" src="https://user-images.githubusercontent.com/84265308/169215782-f5166fce-77e7-4fa1-a8a0-a139dcdde25b.png">

* sequelize를 이용한 마이그레이션과 데이터 모델링 구현
* express-validator를 middleware로 사용하여 http(s) request input type 검사
  * input validation 통과하면 http request를 controller로 보냄
  * input validation 에서 type error 발생하면 status code 400 (BAD REQUEST) response를 client로 보냄
* date-fns 를 이용해서 데이터베이스에 utc 기준으로 저장되어 있는 datetime을 client의 timezone을 기준으로 제공할 수 있도록 함.
* http-status-codes 를 이용해서 코드의 가독성을 높임

## 구현해야하는 기능
* tdd
  * 이유 : 해당 프로젝트를 진행하면서 코드를 수정할 때마다 서버가 정상적으로 기능하는지 매번 테스트하느라 시간을 많이 써야했다. tdd를 통해서 매번 테스트를 해야하는 부담을 덜어낼 수 있을 것으로 생각한다. 
* aws cloudfront를 이용한 동영상 스트리밍 구현
  * 이유 : 현재 aws lambda function으로 동영상 url을 받게되면 스트리밍 기능을 제공하지 않아서 영상이 다 다운로드 되기전까지 영상을 재생할 수 없다. aws cloudfront에서는 동영상 스트리밍과 함께 다양한 region에서 빠른 속도로 영상을 다운로드할 수 있고, 추가적으로 네트워크 보안 기능도 있는 것으로 확인된다.

## 프론트엔드 구경하기

https://github.com/dlwndks9436/akchak-react-native-app
