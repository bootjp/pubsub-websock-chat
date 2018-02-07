# pubsub-websock-chat

This repository is a project for learning of my PubSub.

* 目的
  + 主目的: PubSubを把握し利点欠点を把握する (PubSubというものを知らなかった)
  + 目的: パブリッククラウドに移行することを想定し、技術選定を行う
  * [手書きSNS](https://smoocy.xyz) への導入ができないか検討する。
  
* 要件（目的から逆算した実装できるであろうもの）
  + 複数のチャットルームでのリアルタイムチャットの実装
  + 水平スケールを可能とするため、メッセージ伝達にはPubSubを用いる。 
  
* ToDO 
  * [x] .gitignoreを整理してnode module をコミットしない
  * [ ] typescriptを導入して安全で保守的なコード管理を実現する
  * [ ] ローカル用にdocker コンテナ化
  * [ ] パブリッククラウドのマネージサーバーで同等の実装を行う
  * [ ] ハードコーディングしている環境依存値を環境変数より取得するようにする
  + [ ] リファクタリング
  
* /web/publicフォルダにある `Cyber14-1.mp3` は [Music is VFR](http://musicisvfr.com/free/license.html) 様より


