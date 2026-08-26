const base = process.env.SMOKE_BASE_URL || "https://sahara-pramaan.vercel.app";
const api = `${base}/api/trpc`;

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const query = async (procedure, input) => {
  const url = `${api}/${procedure}?input=${encodeURIComponent(JSON.stringify({ json: input }))}`;
  const response = await fetch(url);
  const body = await response.json();
  assert(response.ok && body.result?.data?.json !== undefined, `${procedure} failed: ${JSON.stringify(body)}`);
  return body.result.data.json;
};

const mutation = async (procedure, input) => {
  const response = await fetch(`${api}/${procedure}?batch=1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 0: { json: input } }),
  });
  const body = await response.json();
  assert(response.ok && body[0]?.result?.data?.json !== undefined, `${procedure} failed: ${JSON.stringify(body)}`);
  return body[0].result.data.json;
};

const checkAsset = async (path) => {
  const response = await fetch(`${base}${path}`);
  assert(response.ok, `${path} returned ${response.status}`);
};

try {
  await checkAsset("/manifest.webmanifest");
  await checkAsset("/sw.js");
  const login = await mutation("prototype.login", { identifier: "DEMO-FAIL", otp: "123456" });
  assert(login.pensionerId === "pensioner-demo-fail", "Unexpected synthetic login result");
  const camps = await query("prototype.camps", { pincode: "110001" });
  assert(Array.isArray(camps) && camps.length > 0, "Synthetic camp list is empty");
  const link = await mutation("prototype.createFamilyLink", { pensionerId: login.pensionerId });
  assert(link.token && link.code, "Synthetic family link was not created");
  const reminder = await mutation("prototype.reminder", { pensionerId: login.pensionerId, sms: false, voice: true, family: false });
  assert(reminder.state.reminder.voice === true && reminder.state.reminder.sms === false, "Reminder write did not persist");
  const readback = await query("prototype.pensioner", { pensionerId: login.pensionerId });
  assert(readback.state.reminder.voice === true && readback.state.reminder.sms === false, "Reminder readback did not persist");
  console.log(JSON.stringify({ ok: true, checks: ["manifest", "service-worker", "login", "camps", "family-link", "reminder-readback"], pensionerId: login.pensionerId }));
} finally {
  await mutation("prototype.reset", {}).catch((error) => {
    console.error(`Synthetic reset failed: ${error.message}`);
    process.exitCode = 1;
  });
}
