# Yosou Markets

選挙、スポーツ、経済、ニュースなどをみんなで予想するマーケット型サイトです。

## 公開URL

https://saitotomoki2007-del.github.io/otameshi/

## 共有DBとログインを有効にする

このサイトはSupabaseに接続すると、予想投稿、ログイン、コメント、結果確定、的中率ランキングを全員で共有できます。

1. Supabaseで新しいプロジェクトを作成
2. `supabase-schema.sql` をSQL Editorで実行
3. `supabase-config.js` にProject URLとanon public keyを設定
4. 変更をコミットして `main` と `gh-pages` にプッシュ

Supabase設定が空のままでも、ブラウザ内デモDBとして動作します。
