import { utils } from "web3"

const allSpecials = '!@#$%^&*?,_.()<>{}|\/~\"\'\:\;\+\`\=\\-\\\\\\[\\]'
const check_password_contain_eight = new RegExp(`^[a-zA-Z0-9${allSpecials}]{8,}$`)
const check_password_contain_upper = new RegExp(`^(?=.*[A-Z])[a-zA-Z0-9${allSpecials}]{1,}$`)
const check_password_contain_number = new RegExp(`^(?=.*[0-9])[a-zA-Z0-9${allSpecials}]{1,}$`)
const check_password_contain_symbol = new RegExp(`^(?=.*[${allSpecials}])[a-zA-Z0-9${allSpecials}]{1,}$`)
const check_email_is_valid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const handleClickScroll = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    // 👇 Will scroll smoothly to the top of the next section
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const rePasswordCheck = (password?: string, rePassword?: string) => {
  if (password && rePassword) return password == rePassword ? null : "Passwords does't match";
  return null;
}

export const passwordCheck = (password?: string) => {
  if (password) {
    console.log(password)
    if (!password.match(check_password_contain_eight)) {
      return "Password must contain 8 or more characters"
    }
    else {
      console.log(password.match(check_password_contain_eight))
    }
    if (!password.match(check_password_contain_upper)) {
      return "Password must contain atleast one uppercase letter"
    }
    if (!password.match(check_password_contain_number)) {
      return "Password must contain atleast one number"
    }
    if (!password.match(check_password_contain_symbol)) {
      return `Password must contain atleast one special symbol: ${allSpecials}`
    }
  }
  return null
}

export const emailCheck = (email?: string) => {
  if (email) {
    if (!email.match(check_email_is_valid)) {
      return "Invalid email"
    }
  }
  return null
}

export const usernameCheck = (username?: string) => {
  if (username) {
    if (username.length < 8) {
      return "Username must contain 8 or more characters"
    }
  }
  return null
}

export const logoutHandler = () => {
  sessionStorage.clear()
}

export function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function hash() {
  return utils.toHex(makeid(32))
  // return "0x" + createHash('sha256').update(makeid(5)).digest('hex');
}

export const toLocalTime = (dateString: string): Date => {
  var dt = new Date(dateString)
  var d = new Date();
  d.setUTCFullYear(dt.getFullYear());
  d.setUTCMonth(dt.getMonth());
  d.setUTCDate(dt.getDate());
  d.setUTCHours(dt.getHours());
  d.setUTCMinutes(dt.getMinutes());
  d.setUTCSeconds(dt.getSeconds());
  return d
}

export function reverseArr(input: any) {
  var ret = new Array;
  for(var i = input.length-1; i >= 0; i--) {
      ret.push(input[i]);
  }
  return ret;
}

export function addDaysDstFail(date: Date, days: number) {
    var dayms = (days * 24 * 60 * 60 * 1000);
    return new Date(date.getTime() + dayms);    
}

export function leftPercentOfPeriod(dateStart: Date, periodDays: number) {
    return (((new Date().getTime() - dateStart.getTime()) / 24 / 60 / 60 / 1000) * 100) / periodDays
}