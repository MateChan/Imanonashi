# Imanonashi

「いまのなし」で前のメッセージを消すやつ

## 使い方

Deno Deployに上げて環境変数で設定するだけ

リポジトリをフォークしてデプロイしてもいいし，ローカルにクローンして`deployctl`とかを使ってくれてもいいよ

| 環境変数名 | 説明 |
| -- | -- |
| `MISSKEY_HOSTNAME` | 自分のインスタンスのホスト名 (`submarin.online`など) |
| `MISSKEY_TOKEN` | APIトークン 権限は必要そうなやつを与えてね |
| `MISSKEY_WEBHOOK_SECRET` | Webhookの設定で入力したシークレット |
