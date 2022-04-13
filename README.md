# resonar-nodejs-server

![resonar_graphic](https://user-images.githubusercontent.com/84265308/163145807-98371dba-4453-44e6-bced-f126387f2e07.png)

# resonar

## 어플 체험해기

https://play.google.com/store/apps/details?id=com.juann.resonar

---------------------------------------------------------
### 프로젝트 계획 이유

저는 취미로 일렉기타를 연주합니다. 
매번 집에서 혼자 일렉기타를 연습할 때마다, 동기부여도 잘 안됐고 제 자신의 실력을 평가하는 것에 어려움을 느꼈습니다.
그래서 자신의 연주를 업로드해서 다른 사람들과 공유하면 이용자끼리 서로 좋은 영향을 주고 받을 수 있을 것이라고 생각했습니다.

### 프로젝트 주요 기능
스마트폰의 카메라를 이용해서 사용자의 연주를 녹화하면서 연주시간을 확인할 수 있습니다.
연주를 끝내면 영상이 저장되며, 저장된 영상을 재생해서 확인해볼 수 있습니다.
그리고 연주 영상 중에 공유하고 싶은 부분이 있으면, 원하는 부분을 자르고 업로드 할 수 있도록 영상 편집 기능이 있습니다.
로그인한 유저들은 업로드된 영상들을 확인해볼 수 있습니다.

### ERD

![악기 연습 데이터베이스 설계1-Page-1 drawio](https://user-images.githubusercontent.com/84265308/163154584-c19701ce-15eb-4924-b146-76eacc5e7c2c.svg)
![악기 연습 데이터베이스 설계1-Page-2 drawio](https://user-images.githubusercontent.com/84265308/163154598-a2283695-abca-47eb-b477-c04a2d736c53.svg)

### db 명세

<img width="788" alt="image" src="https://user-images.githubusercontent.com/84265308/163154078-4679b33a-93a8-4079-8efb-b80a4b00dfa1.png">
<img width="788" alt="image" src="https://user-images.githubusercontent.com/84265308/163154139-be88ca2f-d159-4bd3-8ab7-c7557b763c8c.png">
<img width="788" alt="image" src="https://user-images.githubusercontent.com/84265308/163154188-240cd12c-a239-4341-a0c7-a32fb4dd3af0.png">
<img width="785" alt="image" src="https://user-images.githubusercontent.com/84265308/163154238-c316c3f6-3aa2-4073-8de1-0bef00ed1158.png">
<img width="784" alt="image" src="https://user-images.githubusercontent.com/84265308/163154279-b6c45104-4d39-4060-8d44-62511ac592d9.png">


### infrastructure

![resonar infrastructure](https://user-images.githubusercontent.com/84265308/163152770-5963e180-5cdf-4b9a-b87e-277bad657a12.png)

## 구현한 기능

* Mysql event scheduler를 이용해서 테이블 내 이래 조건에 해당되는 row 삭제
  * 유저가 회원가입한 이후 12 시간 이내에 이메일 인증하지 않을 경우
  * refresh token이 30일 동안 사용되지 않았을 경우
  * 인증코드 발급된지 5분이 지났을 때
* 한글 텍스트 입력 및 조회가 가능하도록 sequelize.js와 aws rds 환경에 charset: utf8, collate: utf8_general_cli 적용
* 삭제되는 데이터를 foreign key로 참조하는 row들이 삭제되도록 cascade 적용
* https 통신이 가능하도록 route53와 acm을 이용해서 resonar.link 도메인 대여 후 ssl 적용
* resonar.link 도메인을 통해서 swagger docs를 조회할 수 있도록 swagger-jsdoc과 swagger-ui-express 사용
* 회원가입할 때 유저가 입력한 이메일로 인증코드 보낼 수 있도록 nodemailer 사용
* eb cli를 통해서 elastic beanstalk로 배포 환경 구축

## 구현해야하는 기능
* 덧글 model와 controller 추가
* 유저 회원탈퇴 기능
* practice model 수정

## 프론트엔드 구경하기

https://github.com/dlwndks9436/resonar-react-native-app
