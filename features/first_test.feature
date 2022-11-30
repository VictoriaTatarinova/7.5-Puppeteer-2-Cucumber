Feature: Ticket Booking - Tests

    Attempts to book tickets (different films, days, time, halls)

    Scenario: User should book ticket (Film 3 - holl 3 - 12:00)  - tomorrow
        Given user is on start page "http://qamid.tmweb.ru/client/index.php"
        When user choose day "Tomorrow"
        And user choose film "Фильм 3" and time "12:00"
        And user choose raw "1" and chair "5" and click it
        And user press Book
        Then user on "http://qamid.tmweb.ru/client/payment.php" page
        And user sees the film suggested "Фильм 3", the hall suggested "Зал3" on payment page
        When user press Show code
        Then user can see QR code

    Scenario: User should book ticket (Film 1 - holl 1 - 15:00)  - tomorrow
        Given user is on start page "http://qamid.tmweb.ru/client/index.php"
        When user choose day "Tomorrow"
        And user choose film "Фильм 1" and time "15:00"
        And user choose raw "1" and chair "4" and click it
        And user press Book
        Then user on "http://qamid.tmweb.ru/client/payment.php" page
        And user sees the film suggested "Фильм 1", the hall suggested "Зал 1" on payment page
        When user press Show code
        Then user can see QR code

    Scenario: User should NOT book booked ticket (Film 3 - holl 3 - 12:00)  - tomorrow
        Given user is on start page "http://qamid.tmweb.ru/client/index.php"
        When user choose day "Tomorrow"
        And user choose film "Фильм 3" and time "12:00"
        And user choose raw "1" and chair "1" and click it
        And user press Book
        Then user should not see the page title "Электорнный билет"
        And user should remain on the "http://qamid.tmweb.ru/client/hall.php" page