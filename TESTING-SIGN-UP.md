# Try out: Sign Up (with optional ORCID iD)

> **Temporary file.** It's here so people can try the sign-up feature before it's merged, and it will be deleted before
> [dataverse-frontend#1141](https://github.com/IQSS/dataverse-frontend/pull/1141) is merged.
> Please report what you find as a comment on that PR.

This guide sets up everything on your computer: the Dataverse backend from
[IQSS/dataverse#12858](https://github.com/IQSS/dataverse/pull/12858), which you build yourself with Maven, and the
Modern UI from this branch. You don't need to change any code or configuration by hand. You can follow it yourself,
or ask an AI coding assistant to "follow TESTING-SIGN-UP.md".

The first setup takes about 30–45 minutes, most of it waiting for builds.

---

## For AI assistants

If a person asked you to run this file:

- Run the steps in order and tell the person in plain language what each step is doing.
- Each step has a **Check**. Don't continue until it passes. If it fails, look at **Troubleshooting** at the end.
- Stop and ask the person before Step 5 (ORCID). It needs their own ORCID sandbox account, which you can't create.
- Never ask for passwords or secrets in chat. The person types the ORCID client secret into their terminal themselves.
- Don't commit, push, or open pull requests. Changes made by this guide are for local testing only.
- When the environment is running, hand over to the person for Step 4. The testing itself is done in the browser.

---

## What you need

| Tool                                                  | Version      | Check with      |
| ----------------------------------------------------- | ------------ | --------------- |
| Docker Desktop, running, with at least 8 GB of memory | recent       | `docker info`   |
| Git                                                   | any          | `git --version` |
| Java (JDK)                                            | 21           | `java -version` |
| Maven                                                 | 3.9 or newer | `mvn -version`  |

About 20 GB of free disk space, and these ports must be free: `8000`, `8080`, `1080`.

If you already run another Dataverse dev environment, stop it first, because it uses the same container names and
ports. `docker ps` should not list any `dev_*` containers.

---

## Step 1. Get the code

Put both repositories next to each other in the same folder:

```bash
mkdir -p ~/dataverse-signup-test && cd ~/dataverse-signup-test

git clone --branch spa-builtin-user-signup https://github.com/IQSS/dataverse.git
git clone --branch feature/create-sign-up https://github.com/IQSS/dataverse-frontend.git
```

If you already have the repositories, `git fetch` and check out those two branches instead.

**Check:** `git -C dataverse branch --show-current` prints `spa-builtin-user-signup`, and
`git -C dataverse-frontend branch --show-current` prints `feature/create-sign-up`.

## Step 2. Build the backend with Maven

This builds Dataverse from the backend PR into a local Docker image called `gdcc/dataverse:unstable`. The Modern
UI's dev environment uses that image in Step 3.

```bash
cd ~/dataverse-signup-test/dataverse
mvn -Pct clean package -DskipTests
```

This takes 5–15 minutes the first time.

**Check:** `docker image ls gdcc/dataverse:unstable` shows an image created a few minutes ago.

> Don't run `docker pull gdcc/dataverse:unstable` after this, because it would replace your build with the public
> image, which doesn't have the sign-up feature.

## Step 3. Start the Modern UI and the backend

```bash
cd ~/dataverse-signup-test/dataverse-frontend

# The dev environment needs an .npmrc file. This minimal one is enough; skip this if you already have one.
[ -f .npmrc ] || echo "legacy-peer-deps=true" > .npmrc

cd dev-env
./run-env.sh unstable
```

This starts Dataverse, the database, Solr, Keycloak (login), a mail catcher, and the Modern UI. They need a few
minutes to start. Wait for the setup container to finish:

```bash
docker wait dev_dataverse_bootstrap
```

Then wait for the Modern UI. Watch its log until it shows `Local: http://localhost:5173/` (press Ctrl+C to stop
watching):

```bash
docker logs -f dev_frontend
```

**Check:** both of these work:

```bash
curl -s http://localhost:8000/api/info/version
# {"status":"OK","data":{"version":"6.12.1", ...}}

curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/modern/sign-up
# 200
```

And this one confirms the backend has the sign-up feature. It should answer with field errors, **not** "API endpoint
does not exist":

```bash
curl -s -X POST -H "Content-Type: application/json" http://localhost:8000/api/users/signup --data '{}'
```

## Step 4. Try it out (no ORCID needed)

Open **http://localhost:8000/modern** in your browser.

Use `localhost` for normal login. The default Keycloak `test` client allows redirects to
`http://localhost:8000/modern/*` only. Opening the Modern UI at `127.0.0.1` and clicking **Log In** instead produces
"Invalid parameter: redirect_uri". Open the `localhost` URL above and click **Log In** again.

Useful pages while testing:

- **Emails** that Dataverse sends (welcome and confirmation): http://localhost:1080
- **Admin login** if you need it: username `dataverseAdmin`, password `admin1`

### Checklist

**Getting to the form**

- [ ] The header shows a "Sign Up" link next to "Log In", and it opens the sign-up page.

**Validation**

- [ ] Submitting the empty form marks every required field.
- [ ] A username with spaces or special characters is rejected.
- [ ] A weak password is rejected with the password rules shown.
- [ ] Different passwords in "Password" and "Retype Password" are rejected.
- [ ] You can't sign up without accepting the terms of use.
- [ ] Signing up with a username or email address that's already taken shows an error on that field.

**Creating the account**

- [ ] After "Create Account", the success page says you're logged in, and the header shows your name.
- [ ] A welcome email with a link to confirm your address arrives at http://localhost:1080.
- [ ] Log out, then log in again with the new username and password.

**Other**

- [ ] Log in, open the Account page and click Log Out. You end up logged out on the home page.
- [ ] Switch the language to Español. The sign-up page is translated.

Optional, for API testers: the same sign-up as a request.

```bash
curl -s -X POST -H "Content-Type: application/json" http://localhost:8000/api/users/signup --data '{
  "username": "apitester", "firstName": "Ada", "lastName": "Lovelace",
  "emailAddress": "apitester@mailinator.com", "password": "Str0ngPassw0rd", "termsAccepted": true
}'
# {"status":"OK","data":{"identifier":"@apitester"}}
```

## Step 5 (optional). Connect an ORCID iD while signing up

This part needs an ORCID **sandbox** account and app. ORCID's sandbox is a free test copy of ORCID, so you don't
use your real ORCID record.

**5a. Create a sandbox app (once, in the browser)**

1. Register at https://sandbox.orcid.org with a `@mailinator.com` email address. The sandbox only sends email to
   mailinator.com, and you need to confirm the address. Read the email at https://www.mailinator.com.
2. Go to **Developer Tools** and register an app with this redirect URI, exactly:
   `http://127.0.0.1:8000/modern/sign-up`
   (ORCID doesn't accept `localhost`, which is why this part uses `127.0.0.1`.)
3. Keep the page with the **Client ID** and **Client secret** open.

**5b. Add the app to Dataverse.** Run this in your terminal, and type the ID and secret when asked. They aren't
saved anywhere else.

```bash
printf "ORCID sandbox Client ID: "; read ORCID_ID
printf "ORCID sandbox Client secret: "; stty -echo; read ORCID_SECRET; stty echo; echo

docker exec -i dev_dataverse curl -s -X POST -H "Content-Type: application/json" \
  http://localhost:8080/api/admin/authenticationProviders --data @- <<EOF
{
  "id": "orcid-sandbox",
  "factoryAlias": "oauth2",
  "title": "ORCID Sandbox",
  "subtitle": "",
  "factoryData": "type: orcid | userEndpoint: https://pub.sandbox.orcid.org/v3.0/{ORCID}/person | clientId: ${ORCID_ID} | clientSecret: ${ORCID_SECRET}",
  "enabled": false
}
EOF
unset ORCID_SECRET

docker restart dev_dataverse dev_nginx_proxy
```

`"enabled": false` keeps "Log In with ORCID" off the login page. Connecting an ORCID iD while signing up still works,
but Dataverse only loads a disabled ORCID provider when it starts, which is why the last line restarts it. Dataverse
then needs 2–3 minutes before the check below works.

**5c. Point the Modern UI at `127.0.0.1` for ORCID testing**

`public/config.js` uses `localhost`, and the ORCID row is hidden on `localhost` because ORCID doesn't accept
`localhost` redirect URIs. While you test ORCID, temporarily change it to `127.0.0.1`:

```bash
cd ~/dataverse-signup-test/dataverse-frontend
sed -i.bak 's#http://localhost:8000#http://127.0.0.1:8000#g' public/config.js && rm public/config.js.bak
grep -c "127.0.0.1:8000" public/config.js   # 4
```

No restart is needed; just reload the page. Undo it when you're done with ORCID (`git checkout public/config.js`,
also in Step 7), so that normal login at `localhost` works again.

**Check:**

```bash
curl -s "http://localhost:8000/api/users/signup/orcid/authorize?redirectUri=http://127.0.0.1:8000/modern/sign-up"
# {"status":"OK","data":{"authorizationUrl":"https://sandbox.orcid.org/oauth/authorize?..."}}
```

### Checklist

Open **http://127.0.0.1:8000/modern/sign-up**. Use `127.0.0.1`, not `localhost`, for this part.

While `config.js` points at `127.0.0.1`, **Log In** goes to Keycloak at `127.0.0.1`, which the default Keycloak `test`
client doesn't allow ("Invalid parameter: redirect_uri"). After signing up, the success page may then show a
**Log In** button instead of logging you in. That's expected here; undo Step 5c and log in at
http://localhost:8000/modern to check the new account.

- [ ] The form has a "Create or Connect your ORCID iD" row.
- [ ] Type a username, then click it and sign in at ORCID. You come back to the form, and the username you typed
      is still there.
- [ ] Empty fields are filled in from your ORCID record: name, email, affiliation, position.
- [ ] If your ORCID employment is linked to an organization with a ROR ID, the ROR logo shows next to the
      affiliation and links to ror.org. Editing the affiliation removes the logo.
- [ ] Create the account. The Account page shows your ORCID iD.
- [ ] Sign up again with a different username and email but the same ORCID iD. It's refused with
      "This ORCID iD is already linked to another account."
- [ ] Cancel at ORCID ("Deny"). You come back to the form with a message and can still sign up without ORCID.

## Step 6. Report what you found

Comment on [dataverse-frontend#1141](https://github.com/IQSS/dataverse-frontend/pull/1141) with:

- which checklist items failed, and what you saw instead (a screenshot helps);
- your browser and operating system;
- for errors, the output of `docker logs dev_dataverse --since 10m 2>&1 | grep -iE "signup|orcid|severe"`.

## Step 7. Clean up

```bash
cd ~/dataverse-signup-test/dataverse-frontend/dev-env
./rm-env.sh                          # stops everything and deletes the test data

cd ..
git checkout public/config.js        # undo Step 5c, if you haven't already
docker image rm gdcc/dataverse:unstable gdcc/configbaker:unstable   # optional: remove the images you built
```

You can then delete the `~/dataverse-signup-test` folder.

---

## Troubleshooting

| What you see                                           | What to do                                                                                                                                                                           |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mvn` fails with "release version 21 not supported"    | Maven is using an older Java. Install JDK 21 and check `mvn -version` shows it.                                                                                                      |
| `502 Bad Gateway` at `/modern`                         | The Modern UI is still starting. Wait for `Local: http://localhost:5173/` in `docker logs -f dev_frontend`. If you restarted a container, also run `docker restart dev_nginx_proxy`. |
| `/api/users/signup` says "API endpoint does not exist" | Dataverse isn't running your build. Repeat Step 2, then `./rm-env.sh` and `./run-env.sh unstable` again.                                                                             |
| Sign-up says "Sign-up via API is not enabled"          | The dev environment wasn't started from this branch's `dev-env`. Run Step 3 from `dataverse-frontend/dev-env`.                                                                       |
| "port is already allocated"                            | Another program or Dataverse environment uses port 8000, 8080 or 1080. Stop it, then run Step 3 again.                                                                               |
| No "Sign Up" link                                      | Hard-reload the page (Shift+Reload). `public/config.js` must have `signUpEnabled: true`.                                                                                             |
| Keycloak login says "Invalid parameter: redirect_uri"  | Open `http://localhost:8000/modern` and click **Log In** again. The default `test` client allows `localhost`, not `127.0.0.1`. If you changed `config.js` in Step 5c, undo it first. |
| ORCID says the redirect URI is invalid                 | The app's redirect URI must be exactly `http://127.0.0.1:8000/modern/sign-up`, and the page must be opened at `127.0.0.1`.                                                           |
| "ORCID is not configured on this installation."        | Step 5b didn't succeed, or Dataverse wasn't restarted after it. Run it again, including the restart, and check it printed `"status":"OK"`.                                           |
| ORCID connect fails with "Internal server error"       | The client ID or secret was saved empty. Run Step 5b again and type both when asked.                                                                                                 |
| The ORCID row doesn't appear                           | The page must be opened at `http://127.0.0.1:8000`, not `localhost`, and Step 5c must be applied. Check `grep -c 127.0.0.1:8000 public/config.js` prints 4, then reload.             |
| Uploading a file fails                                 | Not part of this test, but see "File Storage" in `DEVELOPER_GUIDE.md`.                                                                                                               |
