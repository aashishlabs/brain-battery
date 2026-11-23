import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Brain Battery Cognitive Challenge';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

function clampScore(raw) {
    if (raw === null || raw === '') return 86;
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return 86;
    return Math.min(99, Math.max(40, Math.round(parsed)));
}

export default async function Image(request) {
    const { searchParams } = new URL(request.url);

    const hasBeat = searchParams.get('beat') !== null;
    const score = clampScore(searchParams.get('beat'));
    const mentalAge = Math.max(18, Math.round(52 - score * 0.32));

    const rawFrom = (searchParams.get('from') || '').trim().slice(0, 24);
    const reflex = (searchParams.get('reflex') || '480ms').slice(0, 12);
    const focus = (searchParams.get('focus') || '3/4').slice(0, 10);
    const memory = (searchParams.get('memory') || '4/5').slice(0, 10);

    const titleLabel = rawFrom
        ? `${rawFrom.toUpperCase()}'S BRAIN BATTERY`
        : hasBeat
            ? "CHALLENGER'S BRAIN BATTERY"
            : 'BRAIN BATTERY BENCHMARK';

    const barFillPercent = Math.min(100, Math.max(12, score));
    const accentColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '54px 64px',
                    backgroundColor: '#09090b',
                    backgroundImage:
                        'radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.22), transparent 45%), radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.10), transparent 40%)',
                    color: '#ffffff',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Top Row: Brand Pill & 45s Tag */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 20px',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(16, 185, 129, 0.14)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            color: '#34d399',
                            fontSize: '22px',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                        }}
                    >
                        <span>BRAIN BATTERY</span>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 20px',
                            borderRadius: '999px',
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            color: '#a1a1aa',
                            fontSize: '22px',
                            fontWeight: 600,
                        }}
                    >
                        <span>45-SEC COGNITIVE TEST</span>
                    </div>
                </div>

                {/* Middle Row: Big Score + Mental Age + Battery Bar */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '48px',
                        marginTop: '12px',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div
                            style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                color: '#34d399',
                                letterSpacing: '0.08em',
                            }}
                        >
                            {titleLabel}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '28px' }}>
                            <div
                                style={{
                                    fontSize: '128px',
                                    fontWeight: 900,
                                    lineHeight: 1,
                                    color: '#ffffff',
                                    letterSpacing: '-0.04em',
                                }}
                            >
                                {score}%
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '14px 22px',
                                    borderRadius: '20px',
                                    backgroundColor: '#18181b',
                                    border: '1px solid #27272a',
                                }}
                            >
                                <span style={{ fontSize: '16px', color: '#a1a1aa', fontWeight: 600 }}>
                                    MENTAL AGE
                                </span>
                                <span style={{ fontSize: '36px', color: '#34d399', fontWeight: 800 }}>
                                    {mentalAge} yrs
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Battery Meter */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <div
                            style={{
                                width: '260px',
                                height: '116px',
                                borderRadius: '24px',
                                border: '4px solid #3f3f46',
                                backgroundColor: '#18181b',
                                padding: '10px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: `${barFillPercent}%`,
                                    height: '100%',
                                    borderRadius: '16px',
                                    backgroundColor: accentColor,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                width: '18px',
                                height: '46px',
                                borderTopRightRadius: '10px',
                                borderBottomRightRadius: '10px',
                                backgroundColor: '#3f3f46',
                            }}
                        />
                    </div>
                </div>

                {/* Bottom Row: 3 Metric Badges + Challenge CTA */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px',
                        borderTop: '1px solid #27272a',
                        paddingTop: '28px',
                    }}
                >
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '12px 22px',
                                borderRadius: '16px',
                                backgroundColor: '#18181b',
                                border: '1px solid #27272a',
                            }}
                        >
                            <span style={{ fontSize: '15px', color: '#a1a1aa' }}>REFLEX</span>
                            <span style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
                                {reflex}
                            </span>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '12px 22px',
                                borderRadius: '16px',
                                backgroundColor: '#18181b',
                                border: '1px solid #27272a',
                            }}
                        >
                            <span style={{ fontSize: '15px', color: '#a1a1aa' }}>FOCUS</span>
                            <span style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
                                {focus}
                            </span>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '12px 22px',
                                borderRadius: '16px',
                                backgroundColor: '#18181b',
                                border: '1px solid #27272a',
                            }}
                        >
                            <span style={{ fontSize: '15px', color: '#a1a1aa' }}>MEMORY</span>
                            <span style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>
                                {memory}
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                        }}
                    >
                        <span style={{ fontSize: '24px', fontWeight: 800, color: '#34d399' }}>
                            Can you beat {score}%?
                        </span>
                        <span style={{ fontSize: '18px', color: '#a1a1aa' }}>
                            brain-battery-three.vercel.app
                        </span>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}