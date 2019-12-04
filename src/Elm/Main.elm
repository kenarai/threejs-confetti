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
      ]
    ]
  else 
    div [][]