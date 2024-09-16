import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

const FormatIcon = (props: SvgIconProps) => {
  const newProps = { ...props, sx: { fontSize: 48 } };
  return <SvgIcon {...newProps}>{props.children}</SvgIcon>;
};
const CreditCardIcon = (props: SvgIconProps) => (
  <FormatIcon {...props}>
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 14C0 8.47715 4.47715 4 10 4H38C43.5228 4 48 8.47715 48 14V34C48 39.5228 43.5228 44 38 44H10C4.47715 44 0 39.5228 0 34V14ZM10 8C6.68629 8 4 10.6863 4 14V16H44V14C44 10.6863 41.3137 8 38 8H10ZM44 20H4V34C4 37.3137 6.68629 40 10 40H38C41.3137 40 44 37.3137 44 34V20ZM8 33C8 31.3431 9.34315 30 11 30C12.6569 30 14 31.3431 14 33C14 34.6569 12.6569 36 11 36C9.34315 36 8 34.6569 8 33ZM18 33C18 31.3431 19.3431 30 21 30H27C28.6569 30 30 31.3431 30 33C30 34.6569 28.6569 36 27 36H21C19.3431 36 18 34.6569 18 33Z"
        fill="#BBC2D6"
      />
    </svg>
  </FormatIcon>
);

const DownloadIcon = (props: SvgIconProps) => (
  <FormatIcon {...props}>
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.4142 16.5858C38.1953 17.3668 38.1953 18.6332 37.4142 19.4142L25.4142 31.4142C24.6332 32.1953 23.3668 32.1953 22.5858 31.4142L10.5858 19.4142C9.80474 18.6332 9.80474 17.3668 10.5858 16.5858C11.3668 15.8047 12.6332 15.8047 13.4142 16.5858L22 25.1716V2C22 0.895432 22.8954 0 24 0C25.1046 0 26 0.895432 26 2V25.1716L34.5858 16.5858C35.3668 15.8047 36.6332 15.8047 37.4142 16.5858ZM4 36C4 34.8954 3.10457 34 2 34C0.89543 34 0 34.8954 0 36V38C0 43.5239 4.48131 48 10.0031 48H10.0622H10.1212H10.1801H10.239H10.2978H10.3566H10.4154H10.4741H10.5327H10.5913H10.6498H10.7083H10.7668H10.8252H10.8835H10.9418H11H11.0582H11.1164H11.1745H11.2326H11.2906H11.3485H11.4064H11.4643H11.5221H11.5799H11.6376H11.6953H11.753H11.8105H11.8681H11.9256H11.9831H12.0405H12.0978H12.1552H12.2124H12.2697H12.3269H12.384H12.4411H12.4982H12.5552H12.6122H12.6691H12.726H12.7829H12.8397H12.8964H12.9532H13.0098H13.0665H13.1231H13.1796H13.2362H13.2927H13.3491H13.4055H13.4619H13.5182H13.5745H13.6307H13.6869H13.7431H13.7992H13.8553H13.9113H13.9674H14.0233H14.0793H14.1352H14.191H14.2469H14.3027H14.3584H14.4141H14.4698H14.5255H14.5811H14.6367H14.6922H14.7477H14.8032H14.8586H14.914H14.9694H15.0247H15.08H15.1353H15.1905H15.2457H15.3009H15.356H15.4111H15.4662H15.5212H15.5762H15.6312H15.6861H15.741H15.7959H15.8508H15.9056H15.9604H16.0151H16.0699H16.1246H16.1792H16.2339H16.2885H16.343H16.3976H16.4521H16.5066H16.5611H16.6155H16.6699H16.7243H16.7786H16.833H16.8873H16.9415H16.9958H17.05H17.1042H17.1583H17.2125H17.2666H17.3207H17.3748H17.4288H17.4828H17.5368H17.5908H17.6447H17.6986H17.7525H17.8064H17.8602H17.914H17.9678H18.0216H18.0753H18.1291H18.1828H18.2365H18.2901H18.3438H18.3974H18.451H18.5046H18.5581H18.6117H18.6652H18.7187H18.7721H18.8256H18.879H18.9324H18.9858H19.0392H19.0926H19.1459H19.1992H19.2525H19.3058H19.3591H19.4123H19.4656H19.5188H19.572H19.6251H19.6783H19.7315H19.7846H19.8377H19.8908H19.9439H19.9969H20.05H20.103H20.1561H20.2091H20.2621H20.315H20.368H20.4209H20.4739H20.5268H20.5797H20.6326H20.6855H20.7384H20.7912H20.8441H20.8969H20.9497H21.0025H21.0553H21.1081H21.1609H21.2137H21.2664H21.3192H21.3719H21.4246H21.4773H21.53H21.5827H21.6354H21.6881H21.7408H21.7934H21.8461H21.8987H21.9514H22.004H22.0566H22.1092H22.1618H22.2144H22.267H22.3196H22.3722H22.4247H22.4773H22.5299H22.5824H22.635H22.6875H22.7401H22.7926H22.8451H22.8976H22.9502H23.0027H23.0552H23.1077H23.1602H23.2127H23.2652H23.3177H23.3702H23.4227H23.4752H23.5277H23.5802H23.6326H23.6851H23.7376H23.7901H23.8426H23.895H23.9475H24H24.0525H24.105H24.1574H24.2099H24.2624H24.3149H24.3674H24.4198H24.4723H24.5248H24.5773H24.6298H24.6823H24.7348H24.7873H24.8398H24.8923H24.9448H24.9973H25.0498H25.1024H25.1549H25.2074H25.2599H25.3125H25.365H25.4176H25.4701H25.5227H25.5753H25.6278H25.6804H25.733H25.7856H25.8382H25.8908H25.9434H25.996H26.0486H26.1013H26.1539H26.2066H26.2592H26.3119H26.3646H26.4173H26.47H26.5227H26.5754H26.6281H26.6808H26.7336H26.7863H26.8391H26.8919H26.9447H26.9975H27.0503H27.1031H27.1559H27.2088H27.2616H27.3145H27.3674H27.4203H27.4732H27.5261H27.5791H27.632H27.685H27.7379H27.7909H27.8439H27.897H27.95H28.0031H28.0561H28.1092H28.1623H28.2154H28.2685H28.3217H28.3749H28.428H28.4812H28.5344H28.5877H28.6409H28.6942H28.7475H28.8008H28.8541H28.9074H28.9608H29.0142H29.0676H29.121H29.1744H29.2279H29.2813H29.3348H29.3883H29.4419H29.4954H29.549H29.6026H29.6562H29.7099H29.7635H29.8172H29.8709H29.9247H29.9784H30.0322H30.086H30.1398H30.1936H30.2475H30.3014H30.3553H30.4092H30.4632H30.5172H30.5712H30.6252H30.6793H30.7334H30.7875H30.8417H30.8958H30.95H31.0042H31.0585H31.1127H31.167H31.2214H31.2757H31.3301H31.3845H31.4389H31.4934H31.5479H31.6024H31.657H31.7115H31.7661H31.8208H31.8754H31.9301H31.9849H32.0396H32.0944H32.1492H32.2041H32.259H32.3139H32.3688H32.4238H32.4788H32.5338H32.5889H32.644H32.6991H32.7543H32.8095H32.8647H32.92H32.9753H33.0306H33.086H33.1414H33.1968H33.2523H33.3078H33.3633H33.4189H33.4745H33.5302H33.5859H33.6416H33.6973H33.7531H33.809H33.8648H33.9207H33.9767H34.0326H34.0887H34.1447H34.2008H34.2569H34.3131H34.3693H34.4255H34.4818H34.5381H34.5945H34.6509H34.7073H34.7638H34.8204H34.8769H34.9335H34.9902H35.0468H35.1036H35.1603H35.2171H35.274H35.3309H35.3878H35.4448H35.5018H35.5589H35.616H35.6731H35.7303H35.7876H35.8448H35.9022H35.9595H36.0169H36.0744H36.1319H36.1895H36.247H36.3047H36.3624H36.4201H36.4779H36.5357H36.5936H36.6515H36.7094H36.7674H36.8255H36.8836H36.9418H37H37.0582H37.1165H37.1748H37.2332H37.2917H37.3502H37.4087H37.4673H37.5259H37.5846H37.6434H37.7022H37.761H37.8199H37.8788H37.9378H37.9969C43.5187 48 48 43.5239 48 38V36C48 34.8954 47.1046 34 46 34C44.8954 34 44 34.8954 44 36V38C44 41.3127 41.3116 44 37.9969 44H37.9378H37.8788H37.8199H37.761H37.7022H37.6434H37.5846H37.5259H37.4673H37.4087H37.3502H37.2917H37.2332H37.1748H37.1165H37.0582H37H36.9418H36.8836H36.8255H36.7674H36.7094H36.6515H36.5936H36.5357H36.4779H36.4201H36.3624H36.3047H36.247H36.1895H36.1319H36.0744H36.0169H35.9595H35.9022H35.8448H35.7876H35.7303H35.6731H35.616H35.5589H35.5018H35.4448H35.3878H35.3309H35.274H35.2171H35.1603H35.1036H35.0468H34.9902H34.9335H34.8769H34.8204H34.7638H34.7073H34.6509H34.5945H34.5381H34.4818H34.4255H34.3693H34.3131H34.2569H34.2008H34.1447H34.0887H34.0326H33.9767H33.9207H33.8648H33.809H33.7531H33.6973H33.6416H33.5859H33.5302H33.4745H33.4189H33.3633H33.3078H33.2523H33.1968H33.1414H33.086H33.0306H32.9753H32.92H32.8647H32.8095H32.7543H32.6991H32.644H32.5889H32.5338H32.4788H32.4238H32.3688H32.3139H32.259H32.2041H32.1492H32.0944H32.0396H31.9849H31.9301H31.8754H31.8208H31.7661H31.7115H31.657H31.6024H31.5479H31.4934H31.4389H31.3845H31.3301H31.2757H31.2214H31.167H31.1127H31.0585H31.0042H30.95H30.8958H30.8417H30.7875H30.7334H30.6793H30.6252H30.5712H30.5172H30.4632H30.4092H30.3553H30.3014H30.2475H30.1936H30.1398H30.086H30.0322H29.9784H29.9247H29.8709H29.8172H29.7635H29.7099H29.6562H29.6026H29.549H29.4954H29.4419H29.3883H29.3348H29.2813H29.2279H29.1744H29.121H29.0676H29.0142H28.9608H28.9074H28.8541H28.8008H28.7475H28.6942H28.6409H28.5877H28.5344H28.4812H28.428H28.3749H28.3217H28.2685H28.2154H28.1623H28.1092H28.0561H28.0031H27.95H27.897H27.8439H27.7909H27.7379H27.685H27.632H27.5791H27.5261H27.4732H27.4203H27.3674H27.3145H27.2616H27.2088H27.1559H27.1031H27.0503H26.9975H26.9447H26.8919H26.8391H26.7863H26.7336H26.6808H26.6281H26.5754H26.5227H26.47H26.4173H26.3646H26.3119H26.2592H26.2066H26.1539H26.1013H26.0486H25.996H25.9434H25.8908H25.8382H25.7856H25.733H25.6804H25.6278H25.5753H25.5227H25.4701H25.4176H25.365H25.3125H25.2599H25.2074H25.1549H25.1024H25.0498H24.9973H24.9448H24.8923H24.8398H24.7873H24.7348H24.6823H24.6298H24.5773H24.5248H24.4723H24.4198H24.3674H24.3149H24.2624H24.2099H24.1574H24.105H24.0525H24H23.9475H23.895H23.8426H23.7901H23.7376H23.6851H23.6326H23.5802H23.5277H23.4752H23.4227H23.3702H23.3177H23.2652H23.2127H23.1602H23.1077H23.0552H23.0027H22.9502H22.8976H22.8451H22.7926H22.7401H22.6875H22.635H22.5824H22.5299H22.4773H22.4247H22.3722H22.3196H22.267H22.2144H22.1618H22.1092H22.0566H22.004H21.9514H21.8987H21.8461H21.7934H21.7408H21.6881H21.6354H21.5827H21.53H21.4773H21.4246H21.3719H21.3192H21.2664H21.2137H21.1609H21.1081H21.0553H21.0025H20.9497H20.8969H20.8441H20.7912H20.7384H20.6855H20.6326H20.5797H20.5268H20.4739H20.4209H20.368H20.315H20.2621H20.2091H20.1561H20.103H20.05H19.9969H19.9439H19.8908H19.8377H19.7846H19.7315H19.6783H19.6251H19.572H19.5188H19.4656H19.4123H19.3591H19.3058H19.2525H19.1992H19.1459H19.0926H19.0392H18.9858H18.9324H18.879H18.8256H18.7721H18.7187H18.6652H18.6117H18.5581H18.5046H18.451H18.3974H18.3438H18.2901H18.2365H18.1828H18.1291H18.0753H18.0216H17.9678H17.914H17.8602H17.8064H17.7525H17.6986H17.6447H17.5908H17.5368H17.4828H17.4288H17.3748H17.3207H17.2666H17.2125H17.1583H17.1042H17.05H16.9958H16.9415H16.8873H16.833H16.7786H16.7243H16.6699H16.6155H16.5611H16.5066H16.4521H16.3976H16.343H16.2885H16.2339H16.1792H16.1246H16.0699H16.0151H15.9604H15.9056H15.8508H15.7959H15.741H15.6861H15.6312H15.5762H15.5212H15.4662H15.4111H15.356H15.3009H15.2457H15.1905H15.1353H15.08H15.0247H14.9694H14.914H14.8586H14.8032H14.7477H14.6922H14.6367H14.5811H14.5255H14.4698H14.4141H14.3584H14.3027H14.2469H14.191H14.1352H14.0793H14.0233H13.9674H13.9113H13.8553H13.7992H13.7431H13.6869H13.6307H13.5745H13.5182H13.4619H13.4055H13.3491H13.2927H13.2362H13.1796H13.1231H13.0665H13.0098H12.9532H12.8964H12.8397H12.7829H12.726H12.6691H12.6122H12.5552H12.4982H12.4411H12.384H12.3269H12.2697H12.2124H12.1552H12.0978H12.0405H11.9831H11.9256H11.8681H11.8105H11.753H11.6953H11.6376H11.5799H11.5221H11.4643H11.4064H11.3485H11.2906H11.2326H11.1745H11.1164H11.0582H11H10.9418H10.8835H10.8252H10.7668H10.7083H10.6498H10.5913H10.5327H10.4741H10.4154H10.3566H10.2978H10.239H10.1801H10.1212H10.0622H10.0031C6.68841 44 4 41.3127 4 38V36Z"
        fill="#BBC2D6"
      />
    </svg>
  </FormatIcon>
);

const InitiativesIcon = (props: SvgIconProps) => (
  <FormatIcon {...props}>
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2225_39662)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 0C2.68629 0 0 2.68629 0 6V16C0 19.3137 2.68629 22 6 22H16C19.3137 22 22 19.3137 22 16V6C22 2.68629 19.3137 0 16 0H6ZM4 6C4 4.89543 4.89543 4 6 4H16C17.1046 4 18 4.89543 18 6V16C18 17.1046 17.1046 18 16 18H6C4.89543 18 4 17.1046 4 16V6ZM6 26C2.68629 26 0 28.6863 0 32V42C0 45.3137 2.68629 48 6 48H16C19.3137 48 22 45.3137 22 42V32C22 28.6863 19.3137 26 16 26H6ZM4 32C4 30.8954 4.89543 30 6 30H16C17.1046 30 18 30.8954 18 32V42C18 43.1046 17.1046 44 16 44H6C4.89543 44 4 43.1046 4 42V32Z"
          fill="#BBC2D6"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M32 26C28.6863 26 26 28.6863 26 32V42C26 45.3137 28.6863 48 32 48H42C45.3137 48 48 45.3137 48 42V32C48 28.6863 45.3137 26 42 26H32ZM30 32C30 30.8954 30.8954 30 32 30H42C43.1046 30 44 30.8954 44 32V42C44 43.1046 43.1046 44 42 44H32C30.8954 44 30 43.1046 30 42V32Z"
          fill="#BBC2D6"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M32 0C28.6863 0 26 2.68629 26 6V16C26 19.3137 28.6863 22 32 22H42C45.3137 22 48 19.3137 48 16V6C48 2.68629 45.3137 0 42 0H32ZM30 6C30 4.89543 30.8954 4 32 4H42C43.1046 4 44 4.89543 44 6V16C44 17.1046 43.1046 18 42 18H32C30.8954 18 30 17.1046 30 16V6Z"
          fill="#BBC2D6"
        />
      </g>
      <defs>
        <clipPath id="clip0_2225_39662">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </FormatIcon>
);

const MessageIcon = (props: SvgIconProps) => (
  <FormatIcon {...props}>
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 0C4.47715 0 0 4.47715 0 10V30C0 35.5228 4.47715 40 10 40H14.3431C14.8736 40 15.3823 40.2107 15.7574 40.5858L21.0742 45.9026C22.7103 47.5387 25.3892 47.4495 26.9129 45.7082L31.3099 40.683C31.6897 40.249 32.2383 40 32.8151 40H38C43.5228 40 48 35.5229 48 30V10C48 4.47715 43.5228 0 38 0H10ZM4 10C4 6.68629 6.68629 4 10 4H38C41.3137 4 44 6.68629 44 10V30C44 33.3137 41.3137 36 38 36H32.8151C31.0849 36 29.4389 36.7469 28.2996 38.049L23.9026 43.0742L18.5858 37.7574C17.4606 36.6321 15.9344 36 14.3431 36H10C6.68629 36 4 33.3137 4 30V10ZM12 26C10.8954 26 10 26.8954 10 28C10 29.1046 10.8954 30 12 30H24.0538C25.1584 30 26.0538 29.1046 26.0538 28C26.0538 26.8954 25.1584 26 24.0538 26H12ZM10 11.9962C10 10.8937 10.8937 10 11.9962 10H36.0038C37.1063 10 38 10.8937 38 11.9962C38 13.0986 37.1063 13.9923 36.0038 13.9923H11.9962C10.8937 13.9923 10 13.0986 10 11.9962ZM11.9962 18C10.8937 18 10 18.8937 10 19.9962C10 21.0986 10.8937 21.9923 11.9962 21.9923H36.0038C37.1063 21.9923 38 21.0986 38 19.9962C38 18.8937 37.1063 18 36.0038 18H11.9962Z"
        fill="#BBC2D6"
      />
    </svg>
  </FormatIcon>
);

const NoteIcon = (props: SvgIconProps) => (
  <FormatIcon {...props}>
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 0C8.47715 0 4 4.47715 4 10V38C4 43.5228 8.47715 48 14 48H34C39.5228 48 44 43.5228 44 38V10C44 4.47715 39.5228 0 34 0H14ZM8 10C8 6.68629 10.6863 4 14 4H34C37.3137 4 40 6.68629 40 10V31.0242C39.0611 31.6713 37.1631 32 34.8588 32H13.1403C11.3759 32 9.13667 32.6427 8 33.4129V10ZM8 37.8466V38C8 41.3137 10.6863 44 14 44H34C37.3137 44 40 41.3137 40 38V35.2588C38.5449 35.8463 36.7822 36 34.8609 36H13.1424C10.8359 36 8.93763 36.8775 8 37.8466ZM12 12C12 10.8954 12.8954 10 14 10H32C33.1046 10 34 10.8954 34 12C34 13.1046 33.1046 14 32 14H14C12.8954 14 12 13.1046 12 12ZM14 16C12.8954 16 12 16.8954 12 18C12 19.1046 12.8954 20 14 20H26C27.1046 20 28 19.1046 28 18C28 16.8954 27.1046 16 26 16H14Z"
        fill="#00C5CA"
      />
    </svg>
  </FormatIcon>
);

const EntityIcon = (props: SvgIconProps) => (
  <FormatIcon {...props}>
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.8047 5.36994C22.7682 4.12042 25.2775 4.12042 27.2411 5.36994L43.0784 15.4483C43.6548 15.815 44.0038 16.4508 44.0038 17.134L43.958 19.9807H3.99619L4.04195 17.134C4.04195 16.4508 4.39097 15.815 4.96731 15.4483L20.8047 5.36994ZM29.3865 1.99851C26.114 -0.0840179 21.9318 -0.0840126 18.6592 1.99851L2.82186 12.0768C1.09282 13.1771 0.0457618 15.0845 0.0457618 17.134L0 21.9788C0 23.0823 0.894577 23.9769 1.99809 23.9769H3.99619V43.9579H1.99809C0.894577 43.9579 0 44.8525 0 45.956C0 47.0595 0.894577 47.9541 1.99809 47.9541H5.99428H13.9867H33.9676H41.96H45.9561C47.0597 47.9541 47.9542 47.0595 47.9542 45.956C47.9542 44.8525 47.0597 43.9579 45.9561 43.9579H43.958V23.9769H45.9561C47.0597 23.9769 47.9542 23.0823 47.9542 21.9788L48 17.134C48 15.0845 46.9529 13.1771 45.2239 12.0768L29.3865 1.99851ZM11.9886 43.9579H7.99237V23.977H11.9886V43.9579ZM31.9695 23.9769V43.9579H15.9847V23.9769H31.9695ZM39.9619 43.9579H35.9657V23.977H39.9619V43.9579ZM27.02 12.9421C27.02 14.5974 25.6782 15.9392 24.0229 15.9392C22.3676 15.9392 21.0257 14.5974 21.0257 12.9421C21.0257 11.2868 22.3676 9.94493 24.0229 9.94493C25.6782 9.94493 27.02 11.2868 27.02 12.9421Z"
        fill="#BBC2D6"
      />
    </svg>
  </FormatIcon>
);

const Icons = ({ children }: { children: React.ReactNode }) => <>{children}</>;

Icons.CreditCardIcon = CreditCardIcon;
Icons.MessageIcon = MessageIcon;
Icons.InitiavesIcon = InitiativesIcon;
Icons.DownloadIcon = DownloadIcon;
Icons.NoteIcon = NoteIcon;
Icons.EntityIcon = EntityIcon;

export default Icons;
