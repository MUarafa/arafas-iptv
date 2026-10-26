# Publishing to the TV stores

The store build ships **no account**. A viewer who installs it from a store sees the
welcome screen: Free TV works at once, and their own Xtream account or M3U playlist is
one screen away. Nothing personal is in the package — `./build.sh store` refuses to
package if any server, username or password from `secrets/` turns up inside it.

## Builds

| Store | Command | Output |
|---|---|---|
| LG Content Store | `./build.sh store` | `dist/store/com.muara.iptv_<version>_all.ipk` |
| Samsung Apps (Seller Office) | `TIZEN_PROFILE=<distributor profile> platforms/tizen/build.sh store` | `dist/store/ArafasIPTV_<version>.wgt` |

The Samsung build needs Tizen Studio with the TV extensions and a **distributor**
certificate profile (Certificate Manager → Samsung → TV → *Distributor*, privilege level
*Public*). The developer certificate used for installing on our own TV is tied to that
TV's DUID and is not accepted by the store.

## Typing the account on a hard remote

On the Xtream and M3U forms:

- **OK on a field opens the TV's own keyboard.** It takes voice, the Magic Remote
  pointer, and the phone: the **LG ThinQ** app (LG) and **SmartThings** (Samsung) show a
  phone keyboard that types straight into the field.
- **The full link the provider sent fills all three fields.** `http://host:port/get.php?username=…&password=…`,
  a `player_api.php?…` link, or a stream link `…/live/user/pass/123.ts` — typed or pasted
  into *Server URL*, it is split into server, username and password.
- **`http://` is optional.** `host:8080` is read as `http://host:8080`.
- The arrow-key keyboard under the form stays, for remotes with none of the above.

## LG Content Store

1. Register at **LG Seller Lounge** (seller.lgappstv.com) as an individual or company.
2. *Apps → New App*: app ID `com.muara.iptv` (must match `appinfo.json`), category
   *Entertainment / Video*, free.
3. Upload `dist/store/com.muara.iptv_<version>_all.ipk`.
4. Listing: the texts below, the icon (`app/largeIcon.png`), and screenshots at
   1920×1080 (`docs/screenshots/`).
5. Target: webOS 4.0 and later (2018 models onward, see `PLATFORMS.md`), all countries
   you want — leave out any where you do not want the review risk.
6. Age rating, the privacy policy URL, and the content-rights declaration: *the app
   contains no content; viewers use their own subscription*.
7. Submit for QA. Expect several weeks and questions; answer them from the "Reviewer
   notes" below.

## Samsung Apps TV (Seller Office)

1. Register at **Samsung Apps TV Seller Office** (seller.samsungapps.com/tv) — Samsung
   approves the seller account itself before the first app can be submitted.
2. *Applications → Create*: the app ID is the `tizen:application id` in
   `platforms/tizen/config.xml` (`MuaraIPTV0.ArafasIPTV`); the package ID part
   (`MuaraIPTV0`) must be the one the store assigns or accepts — change config.xml if it
   assigns another.
3. Upload the `.wgt` signed with the distributor profile, with the same listing texts,
   icon and screenshots.
4. Samsung runs a pre-test (launch, Back key, remote navigation, no crash) and then a
   full review. Same reviewer notes.

## Listing text

**Name:** Arafa's IPTV

**Short description (EN):** Watch your own IPTV subscription, plus free public channels.

**Description (EN):**
A fast, remote-friendly player for your own IPTV service. Add your Xtream account or M3U
playlist — press OK on a field to type with the TV keyboard, by voice or from your phone,
or just enter the full link your provider sent — and get live TV, films and series with
continue watching, favourites, search and next-episode. Streams that break are recovered
instead of dropping you out. Includes a Free TV section of publicly available channels.

This app does not provide any content or subscription. You need a service from your own
provider.

**الوصف (AR):**
مشغّل سريع وسهل بالريموت لاشتراك الـ IPTV بتاعك. ضيف حساب Xtream أو قائمة M3U — دوس OK
على أي خانة واكتب بكيبورد التلفزيون أو بالصوت أو من موبايلك، أو حط الرابط كامل اللي جالك
من المزوّد — واتفرج على القنوات والأفلام والمسلسلات مع متابعة المشاهدة والمفضلة والبحث
والحلقة التالية. ولو البث وقع، التطبيق يرجّعه بدل ما يخرّجك. وفيه قسم قنوات مجانية عامة.

التطبيق ده مش بيقدّم أي محتوى أو اشتراك؛ لازم يكون عندك خدمة من مزوّدك.

## Reviewer notes

- The app is a player only. It ships no channel list, no account, and no link to any paid
  service. To test with content, use **Free TV** on the welcome screen (public streams
  from the iptv-org index), or a test Xtream account we provide in the review form.
- Account details are kept only on the TV (local storage) and sent only to the server
  the viewer typed.

## Privacy policy (host it at a public URL, e.g. GitHub Pages)

> **Arafa's IPTV — Privacy policy**
>
> The app does not collect, sell or share personal data, and has no analytics or ads.
> The server address, username and password you enter are stored only on your TV and
> sent only to that server, to sign in and load your channels. Viewing progress,
> favourites and settings are stored only on your TV. The Free TV section loads a public
> channel list from iptv-org.github.io. Uninstalling the app removes everything it
> stored. Contact: arafasiptv@gmail.com

## Before submitting — open points

- **Free TV list.** It comes from the public iptv-org index, which is community
  maintained; not every entry is necessarily licensed. LG has pulled IPTV players over
  unlicensed content. Keeping it is a review risk; dropping it from the store build is
  the safe option.
- **A test account for the reviewers.** Both stores ask for one when the app needs a
  login. Free TV covers the basics, but an Xtream test line lets them see films and
  series.
- **Support email and privacy-policy URL** in your name.
