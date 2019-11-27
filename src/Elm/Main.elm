module Elm.Main exposing (main)

import Browser
import Html exposing (Html, button, div, img, text, ul, li, canvas, p, a)
import Html.Attributes exposing (class, id, value, placeholder, src, href)
import Html.Events exposing (onClick)


main =
  Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias Page = Int

init : Page
init =
  0


-- UPDATE

type Msg = Next | Prev

update : Msg -> Page -> Page
update msg page =
  case msg of
    Next ->
      page + 1

    Prev ->
      page - 1


-- VIEW

view : Page -> Html Msg
view page =
  if page == 0 then 
    div [id "wrapper-all"] [
      canvas [id "canvas"] [],
      div [id "wrapper-init"] [
        div [id "title-init"] [text "MelanCute"],
        div [id "scroll-init"] [text "SCROLL"]
      ],
      div [id "wrapper-author"][
        div [id "title-author"][text "PROFILE"],
        img [id "icon-author", src "https://avatars0.githubusercontent.com/u/41922817?s=400" ] [],
        div [id "box-author"] [
          div [id "name-author"][text "reta(レタ)"],
          div [id "script-author"][text "趣味の良い一次創作が大好き"]
        ]
      ],
      div [id "wrapper-skill"][
        div [id "title-skill"] [text "SKILLS"],
        div [id "box-skill"] [
          div [class "headline-skill"][text "2D graphic"],
          div [class "caption-skill"][text "週に七日のペースで描いてる、Photoshopで塗るようなリアルタッチな絵が好き"],
                    div [class "headline-skill"][text "3D graphic"],
          div [class "caption-skill"][text "時々Blenderで絵の背景に使うオブジェクト作って取り込んだりしてるけど描いた方が早い事が多い"],
          div [class "headline-skill"][text "HTML / CSS / SCSS"],
          div [class "caption-skill"][text "サーバーサイドからじゃなくてフロントエンドから入ったタイプだけど、あんまり書きたくない"],
          div [class "headline-skill"][text "javascript / Typescript"],
          div [class "caption-skill"][text "このサイトもそうだけど、インタラクティブな表現が好きでそれなりに書いた事がある"],
          div [class "headline-skill"][text "WegGL / Three.js"],
          div [class "caption-skill"][text "このサイトのWegGLはThree.jsで書かれている、生のWegGLでも書けなくはないけど多分ちょっと時間かかる"],
          div [class "headline-skill"][text "C# / .Net Framework"],
          div [class "caption-skill"][text "アルバイトで書いてる、.Net Coreじゃなくて.Net Frameworkという事はつまり"],
          div [class "headline-skill"][text "ASP.Net / Entity Framework"],
          div [class "caption-skill"][text "もう古いwebサービスの保守は嫌めう……"],
          div [class "headline-skill"][text "and several languages and frameworks"],
          div [class "caption-skill"][text "書いた事がある程度で良ければそれなりにある気がします"]
        ]
      ]
      --div [id "wrapper-note"] [
        --div [id "title-note"] [text "NOTES"],
        --p [class "script-note"] [text "Latest Update Nov 2019"],
        --p [class "script-note"] [text "読んでくれてありがとう、絵とか貼るべきなんだろうけど何かここにはダサくて貼りたくない"],
        --p [class "script-note"] [text "WegGLは及第点なのだけどそれ以外が心もとなく、今後の改善に期待だ"],
        --p [class "script-note"] [text "topのマウスドラッグで5秒くらい遊べるけどグリッチノイズで目が悪くなるのでやめた方がいいと思う"],
        --p [class "script-note"] [text "紙吹雪の色変わるのは目に嬉しいが自分はもっとダークな方が好きで方向性を変えたくなかった、自分を簡単に曲げてはいけない"],
        --p [class "script-note"] [text "何かフォロワーがelmを書いてる人でじゃあ自分も便乗と思ってこのサイトをelmで書いてみたのだけど、全然活用する所なかった（静的ページだしな）"],
        --p [class "script-note"] [text "今後のアップデートで全体的にダークで悪趣味な感じにする予定なので、趣味が合う者は楽しみにしておいて欲しい……"]
        --p [class "script-note"] [text "GitHubです https://github.com/reretta"]
      --]
    ]
  else 
    div [][]