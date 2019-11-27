module Elm.Main exposing (main)

import Browser
import Html exposing (Html, button, div, text, ul, li, canvas)
import Html.Attributes exposing (class, id, value, placeholder)
import Html.Events exposing (onClick)


main =
  Browser.sandbox { init = init, update = update, view = view }


-- MODEL

type alias Page = Int

init : Page
init =
  0


-- UPDATE

type Msg = Next | Before

update : Msg -> Page -> Page
update msg page =
  case msg of
    Next ->
      page + 1

    Before ->
      page - 1


-- VIEW

view : Page -> Html Msg
view page =
  if page == 0 then
    div [][
      div [id "wrapper-top"]
        [ div [ id "title-top" ] [ text "Art, Code, and Everything" ],
          div [ id "content-box"] [
            div [ id "name-top" ] [ text "This page is graffiti of reta(レタ)" ],
            div [ id "activity-top" ] [ text "Activities : ",
                div [class "list-top"] [ text "2D graphics" ],
                div [class "list-top"] [ text "frontend" ],
                div [class "list-top"] [ text "serverside" ]
            ],
            div [ id "like-top" ] [ text "Like : Internet, weird things......" ],
            div [ id "weirdText-top" ] [text "Latest Update Nov 2019"]
          ],
          div [ id "title-next", onClick Next] [text "more informations"]
        ],
        canvas [id "canvas"] []
    ]
  else
    div [][
      div [] [ text "now under constructing"],
      div [ id "title-next", onClick Before] [text "prev"]
    ]